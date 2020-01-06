export type Framework = 'angular' | 'react' | 'ionic' | 'reactnative' | string
export type Dependency = {
  name: string
  version: string
}
export type Script = {
  name: string;
  command: string;
}
export type PackageJSON = {
  dependencies: object;
  devDependencies?: object;
  browserslist?: object;
  scripts?: object;
}

export type Branch = {
  name: Framework | string
  node: string
  test: string
  build: string
}

export type BuildExampleProps = {
  repository: string
  description: string
  push?: boolean
  clean?: boolean
  update?: boolean
  branches?: Array<Branch>
}

export type UpdateExampleProps = {
  repository: string
  description: string
  files: MetaFiles
  branches?: Array<Branch>
}

export type MetaFiles = {
  readme: boolean
  circle: boolean
  editor: boolean
  ignore: boolean
  license: boolean
  images: boolean
}
