export interface TreeNode {
  id?: number;
  name: string;
  isBranch?: boolean;
  children?: TreeNode[];
  metadata?: Record<string, string | number | boolean | undefined | null>;
  // parent?: number | null;
}
