export interface TerraformCode {
  modules: TerraformModule[];
  variables: string;
  outputs: string;
  mainTf: string;
  backendTf?: string;
}

export interface TerraformModule {
  name: string;
  path: string;
  content: string;
}
