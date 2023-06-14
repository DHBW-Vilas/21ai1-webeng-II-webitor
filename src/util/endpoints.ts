import { WSDir, WSElement, WSFile, Workspace } from '../models';

export interface Res {
	success: boolean;
}

export interface ResGetWorkspaces extends Res {
	workspaces: Workspace[];
}

export interface ResCreateWorkspace extends Res {
	workspaceId: string;
}

export interface ResCreateFile extends Res {
	el: WSFile;
}

export interface ResCreateDir extends Res {
	el: WSDir;
}
