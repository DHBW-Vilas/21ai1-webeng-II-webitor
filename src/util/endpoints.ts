import { WSDir, WSElement, WSFile, WSId, Workspace } from '../models';

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
	workspaceId: string;
}

export interface ResCreateDir extends Res {
	el: WSDir;
	workspaceId: string;
}
