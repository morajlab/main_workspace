import { Rule } from '@angular-devkit/schematics';
interface Schema {
    name: string;
    project: string;
    style: string;
    directory?: string;
    flat?: boolean;
}
export default function (options: Schema): Rule;
export {};
