import { Workspace } from '../models';

export interface Res {
	success: boolean;
}

export interface ResGetWorkspaces extends Res {
	workspaces: Workspace[];
}

export interface ResCreateWorkspace extends Res {
	workspaceId: string;
}
