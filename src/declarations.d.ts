// declarations.d.ts
declare module "*.jpg" {
    const value: string;
    export default value;
  }
  
  declare module "*.png" {
    const value: string;
    export default value;
  }
  
  declare module "*.svg" {
    const value: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default value;
  }
  
  declare module "*.gif" {
    const value: string;
    export default value;
  }
  
  declare module "*.css";
  declare module "*.scss";
  