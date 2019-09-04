export type Framework = 'angular' | 'react' | 'ionic' | 'reactnative'
export type Dependency = {
  name: string
  version: string
}
export type PackageJSON = {
  dependencies: object
  devDependencies?: object
  browserslist?: object
}

export type Branch = {
  name: Framework
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
