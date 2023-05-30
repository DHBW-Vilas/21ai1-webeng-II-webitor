export function findFileById(root: any, id: any): any;
export function findDirById(root: any, id: any): any;
export function deleteFileById(root: any, id: any): any;
export function deleteDirById(root: any, id: any): any;
export function deleteById(root: any, id: any): any;
/**
 * @param {archiver.Archiver} Archiver The Archiver used to archive the directory
 * @param {*} dir The workspace directory to archive
 * @param {String} path The path from the workspace root to this directory
 */
export function archiveDir(Archiver: archiver.Archiver, dir: any, path?: string): void;
