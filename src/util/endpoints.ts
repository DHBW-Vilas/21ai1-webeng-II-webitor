import { WSDir, WSElement, WSFile, WSId, Workspace } from '../models';

export interface Res {
	success: boolean;
	err: string | undefined;
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
