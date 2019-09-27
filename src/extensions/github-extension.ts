import { GluegunToolbox } from 'gluegun';
import { ApiResponse } from 'apisauce';
import { EXAMPLE_BRANCHES, REQUIRED_LABELS } from '../constants';

module.exports = (toolbox: GluegunToolbox) => {
    // get the prompt function from the toolbox
    const {
        http,
        print,
        strings,
        prompt,
        bash,
    } = toolbox;

    let token = process.env.GITHUB_ACCESS_TOKEN;
    const api = http.create({
        baseURL: 'https://api.github.com/',
        headers: {
            "Accept": 'application/vnd.github.v3+json, application/vnd.github.symmetra-preview+json, application/vnd.github.dorian-preview+json, application/vnd.github.baptiste-preview+json, application/vnd.github.luke-cage-preview+json',
            "Content-Type": "application/json"
        }
    });

    interface Label {
        name: string,
        color: string,
        description: string
    }

    async function checkToken(): Promise<void> {
        if (token) {
            api.setHeader('Authorization', `token ${token}`);
            return;
        }
        const promptResult = await prompt.ask({
            type: 'input',
            name: 'param',
            message: 'GitHub Access Token'
        })
        if (promptResult && promptResult.param) {
            token = promptResult.param;
        }
        if (!token) {
            print.error('No GitHub Access Token found');
            process.exit(1);
        }
        else api.setHeader('Authorization', `token ${token}`);
    }

    // check if repository exists
    async function checkRepositoryExists(repo: string): Promise<ApiResponse<Object, Object>> {
        return api.get(`repos/pxblue/${repo}`);
    }

    // get repositories
    async function getRepositories(): Promise<ApiResponse<Object, Object>> {
        return api.get(`orgs/pxblue/repos`, { type: 'public' });
    }

    // get repository status
    async function listRepositoryLabels(repo: string, log: boolean = false): Promise<ApiResponse<Object, Object>> {
        const info: any = await api.get(`repos/pxblue/${repo}/labels`);
        if (log) {
            if (!info) {
                print.error(`Couldn't find the repository`);
                process.exit(1);
            }
            if (info.status === 200) {
                let tags = [];
                info.data.forEach((tag) => {
                    tags.push(tag.name);
                })
                print.info(`Found ${tags.length} labels:`);
                print.info(tags);
            }
            else {
                print.error('Repository not found');
                process.exit(1);
            }
        }
        else return info;
    }

    async function getRepositoryBranches(repo: string, isProtected: boolean | null = null, log: boolean = false): Promise<ApiResponse<Object, Object>> {
        const info: any = await api.get(`repos/pxblue/${repo}/branches`,
            toolbox.isNull(isProtected) ? {} : { protected: isProtected }
        );
        if (log) {
            if (!info) {
                print.error(`Couldn't find the repository`);
                process.exit(1);
            }
            if (info.status === 200) {
                let branches = [];
                info.data.forEach((branch) => {
                    branches.push(branch.name);
                })
                print.info(`Found ${branches.length} branches:`);
                print.info(branches);
            }
            else {
                print.error('Repository not found');
                process.exit(1);
            }
        }
        else return info;
    }

    // get repository vulnerability checks /repos/:owner/:repo/vulnerability-alerts
    async function getRepositoryVulnerabilities(repo: string): Promise<boolean> {
        await checkToken();

        const response = await api.get(`repos/pxblue/${repo}/vulnerability-alerts`);
        return (response && response.status === 204);
    }

    async function setVulnerabilityAlerts(repository: string): Promise<void> {
        await checkToken();

        const response = await api.put(`repos/pxblue/${repository}/vulnerability-alerts`);
        if (!response || response.status !== 204) {
            print.warning(`Unable to enable vulnerability alerts for ${repository}`);
        }
    }

    async function repairMissingBranches(repository: string, description: string): Promise<void> {
        await checkToken();

        // get the branches
        const existingBranches: any = (await getRepositoryBranches(repository)).data;

        const newBranches = EXAMPLE_BRANCHES.filter((branch) => {
            return !existingBranches.find((exBranch) => {
                return exBranch.name === branch.name;
            })
        })

        await bash.buildExampleRepository({ repository, description, branches: newBranches });

        for (let i = 0; i < newBranches.length; i++) {
            await addBranchRestrictions(repository, newBranches[i].name);
        }
    }

    // create a new repository
    async function createRepository(repo: string, description: string, isPrivate: boolean = true): Promise<void> {
        await checkToken();
        let spinner;

        spinner = toolbox.print.spin('Creating Repository');
        const response: any = await api.post(`orgs/pxblue/repos`,
            {
                name: strings.kebabCase(repo),
                description: `Shows how to ${description}`,
                private: isPrivate
            }
        );
        // const response = {status: 201, data: {name: strings.kebabCase('test'), url:'http://test'}};
        if (!response) {
            spinner.fail(`Unable to create the repository`);
            process.exit(1);
        }
        if (response.status === 201) {
            const repository = response.data.name;
            spinner.succeed('Repository Created');
            if (toolbox.parameters.options.empty) { return; }

            try {
                // build the branches
                await bash.buildExampleRepository({ repository, description });

                // check if the branches are there
                const branchStatus = await toolbox.status.checkStatus(repository);
                if (!toolbox.status.checkBranches(branchStatus.details.featureBranches)) {
                    print.error('Branches were not successfully added to the repository.');
                    print.error('Ensure you have the proper permissions and try again.');
                    process.exit(1);
                }

                // add branch permissions
                spinner = toolbox.print.spin('Adding Branch Protections Rules');
                for (let i = 0; i < EXAMPLE_BRANCHES.length; i++) {
                    await addBranchRestrictions(repository, EXAMPLE_BRANCHES[i].name);
                }
                spinner.succeed('Added Branch Protection Rules');

                // add the issue labels
                spinner = toolbox.print.spin('Updating Issue Labels');
                await repairRepositoryLabels(repository);
                spinner.succeed('Updated Issue Labels');

                // add vulnerability updates
                spinner = toolbox.print.spin('Enabling Vulnerability Checks');
                await setVulnerabilityAlerts(repository);
                spinner.succeed('Vulnerability Checks Added');

                // output the repository status
                toolbox.status.printSingle(repository, true);
            }
            catch (e) {
                print.error(e);
                process.exit(1);
            }
        }
        else {
            spinner.fail(`Unable to create the repository (${response.status})`);
            process.exit(1);
        }
    }

    async function addBranchRestrictions(repository: string, branch: string): Promise<void> {
        await checkToken();

        const response: any = await api.put(`repos/pxblue/${repository}/branches/${branch}/protection`,
            {
                required_status_checks: null,
                enforce_admins: null,
                required_pull_request_reviews: {
                    dismissal_restrictions: {},
                    dismiss_stale_reviews: false,
                    require_code_owner_reviews: false,
                    required_approving_review_count: 1
                },
                restrictions: null
            }
        );
        if (!response || response.status !== 200) {
            print.error(`Unable to update branch protection for ${repository} (${branch})`);
            process.exit(1);
        }
    }

    async function removeBranchRestrictions(repository: string, branch: string): Promise<void> {
        await checkToken();

        const response: any = await api.delete(`repos/pxblue/${repository}/branches/${branch}/protection`);
        if (!response || response.status !== 204) {
            print.error(`Unable to update branch protection for ${repository} (${branch})`);
            process.exit(1);
        }
    }

    async function getRepositoryLabels(repository: string): Promise<Array<Label>> {
        await checkToken();

        const response: any = await api.get(`repos/pxblue/${repository}/labels`);
        if (!response || response.status !== 200) {
            print.error(`Unable to retrieve issue labels for ${repository}`);
            process.exit(1);
        }
        return response.data;
    }
    async function addRepositoryLabel(repository: string, label: Label): Promise<void> {
        await checkToken();

        const response: any = await api.post(`repos/pxblue/${repository}/labels`, label);
        if (!response || response.status !== 201) {
            print.error(`Unable to add issue label for ${repository} (${label.name})`);
            process.exit(1);
        }
        return;
    }
    async function updateRepositoryLabel(repository: string, label: Label): Promise<void> {
        await checkToken();

        const response: any = await api.patch(`repos/pxblue/${repository}/labels/${label.name}`, label);
        if (!response || response.status !== 200) {
            print.error(`Unable to update issue label for ${repository} (${label.name})`);
            process.exit(1);
        }
        return;
    }
    async function removeRepositoryLabel(repository: string, label: Label): Promise<void> {
        await checkToken();

        const response: any = await api.delete(`repos/pxblue/${repository}/labels/${label.name}`);
        if (!response || response.status !== 204) {
            print.error(`Unable to remove issue label for ${repository} (${label.name})`);
            process.exit(1);
        }
        return;
    }


    async function repairRepositoryLabels(repository: string): Promise<void> {
        await checkToken();

        const currentLabels: Array<Label> = await getRepositoryLabels(repository);
        for (let i = 0; i < REQUIRED_LABELS.length; i++) {
            if (currentLabels.find((label: Label) => label.name === REQUIRED_LABELS[i].name)) {
                await updateRepositoryLabel(repository, REQUIRED_LABELS[i]);
            }
            else {
                await addRepositoryLabel(repository, REQUIRED_LABELS[i]);
            }
        }
        for (let i = 0; i < currentLabels.length; i++) {
            if (!REQUIRED_LABELS.find((label: Label) => label.name === currentLabels[i].name)) {
                await removeRepositoryLabel(repository, currentLabels[i]);
            }
        }
    }

    async function createPullRequest(repository: string, src: string, dest: string, title?: string, description?: string): Promise<void> {
        await checkToken();

        const response: any = await api.post(`repos/pxblue/${repository}/pulls`, {
            title: title || 'Automated Pull Request From CLI',
            body: description || "This is an automated Pull Request generated by the PX Blue CLI",
            head: src,
            base: dest
        });
        if (!response || response.status !== 201) {
            print.error(`Unable to create pull request for ${repository} (${src})`);
            process.exit(1);
        }
        return;
    }

    // Attach github tools to the toolbox
    toolbox.github = {
        checkRepositoryExists,
        getRepositories,
        listRepositoryLabels,
        getRepositoryBranches,
        getRepositoryVulnerabilities,
        createRepository,
        addBranchRestrictions,
        removeBranchRestrictions,
        repairRepositoryLabels,
        repairMissingBranches,
        createPullRequest
    };
}