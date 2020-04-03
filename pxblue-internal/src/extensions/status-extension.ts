
import { GluegunToolbox } from 'gluegun'

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
    const { print, countString, github, printList } = toolbox;
    const { colors, table } = print;
    const { success, error } = colors;

    const requiredBranches = [
        'angular', 'react', 'reactnative', 'ionic'
    ];
    // const defaultBranch = 'angular';

    const requiredLabels = [
        'android', 'angular', 'bug', 'chrome',
        'edge', 'enhancement', 'external dependency', 'firefox',
        'ie11', 'ionic', 'react-native', 'react',
        'safari', 'wontfix'
    ];
    interface Status {
        valid: boolean,
        details?: {
            exists: Array<string>,
            labels: Array<string>,
            proBranches: Array<string>,
            featureBranches: Array<string>,
            vulnerabilities: boolean
        }
    }

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        if (a.length !== b.length) return false;

        a.sort();
        b.sort();

        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function checkBranches(branches: Array<string>): boolean {
        return arraysEqual(branches, requiredBranches);
    }

    function checkLabels(labels: Array<string>): boolean {
        return arraysEqual(labels, requiredLabels);
    }

    function toString(status: boolean): string {
        return status ? success('VALID') : error('INVALID');
    }

    async function printStatus(repository: string, detailed: boolean = false): Promise<void> {
        const status = await checkStatus(repository);
        const {
            exists,
            proBranches,
            featureBranches,
            labels,
            vulnerabilities
        } = status.details;

        if (!exists) {
            print.info(`${repository}: ${print.colors.error('NOT FOUND')}`);
            return
        }

        // Output the status table
        if (toolbox.parameters.options.detailed || detailed) {
            table(
                [
                    [`${repository}`, 'Count', 'Values', 'Expected', 'Status'],
                    ['Protected\nBranches', countString(proBranches), printList(proBranches), printList(requiredBranches), toString(checkBranches(proBranches))],
                    ['Other\nBranches', countString(featureBranches), printList(featureBranches), '--', '--'],
                    ['Labels', countString(labels), printList(labels), printList(requiredLabels), toString(checkLabels(labels))],
                    ['Vulnerability\nAlerts', '', vulnerabilities ? 'ENABLED' : 'DISABLED', 'ENABLED', toString(vulnerabilities)]
                ],
                { format: 'lean' }
            )
        }
        else print.info(`${repository}: ${toString(checkLabels(labels) && checkBranches(proBranches) && vulnerabilities)}`);
    }

    async function printAll(): Promise<void> {
        let repositories = [];
        let response = await github.getRepositories();
        if (response && response.status === 200) {
            response.data.forEach((repository) => {
                repositories.push(repository.name);
            })
        }
        else {
            print.error('Unable to load repositories');
            process.exit(1);
        }
        repositories.sort();
        for (let i = 0; i < repositories.length; i++) {
            await printStatus(repositories[i]);
        }
        print.info(`Discovered ${repositories.length} public repositories`);
    }

    async function printSingle(repository: string, detailed: boolean = false): Promise<void> {
        if (repository) await printStatus(repository, detailed);
    }

    async function checkStatus(repository: string): Promise<Status> {
        let status = {
            valid: true,
            details: {
                exists: null,
                labels: null,
                proBranches: null,
                featureBranches: null,
                vulnerabilities: null
            }
        };

        // check if the repository exists
        let response = await github.checkRepositoryExists(repository);
        if (!response || response.status !== 200) {
            status.valid = false;
            status.details.exists = false;
            return status;
        }
        else status.details.exists = true;

        // get the labels
        let labels = [];
        response = await github.listRepositoryLabels(repository);
        if (response && response.status === 200) {
            response.data.forEach((label) => {
                labels.push(label.name);
            });
        }
        else {
            labels = null;
            status.valid = false;
        }
        status.details.labels = labels;

        // get the protected branches
        let proBranches = [];
        response = await github.getRepositoryBranches(repository, true);
        if (response && response.status === 200) {
            response.data.forEach((branch) => {
                proBranches.push(branch.name);
            })
        }
        else {
            proBranches = null;
            status.valid = false;
        }
        status.details.proBranches = proBranches;

        // get the feature branches
        let featureBranches = [];
        response = await github.getRepositoryBranches(repository, false);
        if (response && response.status === 200) {
            response.data.forEach((branch) => {
                featureBranches.push(branch.name);
            })
        }
        else featureBranches = null;
        status.details.featureBranches = featureBranches;

        // get the vulnerability alerts status
        const vulnerabilities = await github.getRepositoryVulnerabilities(repository);
        if (!vulnerabilities) {
            status.valid = false;
        }
        status.details.vulnerabilities = vulnerabilities;

        return status;
    }

    toolbox.status = {
        printAll,
        printSingle,
        checkStatus,
        checkBranches
    }
    // enable this if you want to read configuration in from
    // the current folder's package.json (in a "pxb" property),
    // pxb.config.json, etc.
    // toolbox.config = {
    //   ...toolbox.config,
    //   ...toolbox.config.loadConfig(process.cwd(), "pxb")
    // }
}
