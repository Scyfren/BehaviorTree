/**
 * Constants and types used for statuses
 */
export declare const SUCCESS = 1;
export declare const FAIL = 2;
export declare const RUNNING = 3;

export type TREE_OUTCOME = typeof SUCCESS | typeof FAIL | typeof RUNNING;

/**
 * Type definition for Behavior Trees. The run method returns undefined when
 */
export interface BehaviorTree<O extends object> {
	/** Nodes that compose the behavore tree */
	nodes: Node<O>[];
	/** The index of the node currently being processed */
	index: number;
	/** The object used to share data accross the behavior tree. This can be anything. */
	object: O | undefined;

	/** Run the behavior tree with optional arguments that are passed to all nodes.
	 * May be called multiple times when TREE_OUTCOME that is returned is RUNNING.
	 */
	run(obj: O, ...args: unknown[]): TREE_OUTCOME | undefined;
	Run: this["run"];

	/** Calls finish(...args) on the running task of the tree and sets the tree index back to 1. */
	abort(...args: unknown[]): void;
	Abort: this["abort"];
}

export interface Node<O extends object, T extends string = string, P extends object = {}> {
	type: T;
	params: P;

	/** DO NOT USE, ONLY USED FOR TYPE INFERENCE */
	____obj: O;
}

/** Parameters that can be used when creating differant types of nodes. Not all parameters can be used by all types of nodes.
 * TODO: Create parameters specific to each type of node.
 */
export interface NodeParams {
	weight?: number;
}

export interface TaskNodeParams<O> extends NodeParams {
	start?: (object: O, ...args: unknown[]) => void;
	run: (object: O, ...args: unknown[]) => TREE_OUTCOME;
	finish?: (object: O, status: TREE_OUTCOME, ...args: unknown[]) => void;
}

type ObjectStringValues<O extends object, B extends string> = {
	[K in keyof O]: B extends "Entity" ? (O[K] extends string ? O[K] : never) : string;
};

export interface BlackboardNodeParams<O extends object, B extends string> extends NodeParams {
	key: string;
	/** string that defaults to "Entity" if no value is specified.
	 * - "Entity" will reference the object's blackboard passed into the tree via tree.run(object)
	 * - If a value is given, say "WorldStates", it will attempt to grab the Shared Blackboard to use with the same name. You can register these via BehaviorTreeCreator.RegisterSharedBlackboard(name, table) */
	board: B;
	/** string which specifies what kind of query you’re trying to perform.
	 * You can choose true, false, set, or unset to perform boolean/nil checks. Alternatively you can specify a string of your choice to perform a string comparison */
	returntype: "true" | "false" | "unset" | "set" | ObjectStringValues<O, B>[keyof ObjectStringValues<O, B>];
}

export interface TreeNodeParams<O extends object> extends NodeParams {
	tree: BehaviorTree<O>;
}

export interface SucceedNodeParams<O extends object> extends NodeParams {
	nodes: [] | [Node<O>];
}

export interface FailNodeParams<O extends object> extends NodeParams {
	nodes: [] | [Node<O>];
}

export interface InvertNodeParams<O extends object> extends NodeParams {
	nodes: [Node<O>];
}

export interface RepeatNodeParams<O extends object> extends NodeParams {
	nodes: [Node<O>];
	count?: number;
	breakonfail: boolean;
}

export interface WhileNodeParams<O extends object> extends NodeParams {
	nodes: [Node<O>, Node<O>];
	count?: number;
}

export type NonEmptyArray<T> = [T, ...T[]];

export interface SequenceNodeParams<O extends object> extends NodeParams {
	nodes: NonEmptyArray<Node<O>>;
}

export interface SelectorNodeParams<O extends object> extends NodeParams {
	nodes: NonEmptyArray<Node<O>>;
}

export interface RandomNodeParams<O extends object> extends NodeParams {
	nodes: NonEmptyArray<Node<O>>;
}

/** The parameter object passed in when a tree is created. */
export interface BehaviorTreeParams<O extends object> {
	tree: Node<O>;
}

/** Constructor and static methods found on the exported BehaviorTree module. */
interface BehaviorTreeConstructor {
	new <O extends object>(params: BehaviorTreeParams<O>): BehaviorTree<O>;

	Sequence: <O extends object>(params: SequenceNodeParams<O>) => Node<O, "sequence", typeof params>;
	Selector: <O extends object>(params: SelectorNodeParams<O>) => Node<O, "selector", typeof params>;
	Random: <O extends object>(params: RandomNodeParams<O>) => Node<O, "random", typeof params>;
	While: <O extends object>(params: WhileNodeParams<O>) => Node<O, "while", typeof params>;

	Succeed: <O extends object>(params: SucceedNodeParams<O>) => Node<O, "always_succeed", typeof params>;
	Fail: <O extends object>(params: FailNodeParams<O>) => Node<O, "always_fail", typeof params>;
	Invert: <O extends object>(params: InvertNodeParams<O>) => Node<O, "invert", typeof params>;
	Repeat: <O extends object>(params: RepeatNodeParams<O>) => Node<O, "repeat", typeof params>;

	Task: <O extends object>(params: TaskNodeParams<O>) => Node<O, "task", typeof params>;
	Tree: <O extends object>(params: TreeNodeParams<O>) => Node<O, "tree", typeof params>;
	["Blackboard Query"]: <O extends object, B extends string>(
		params: BlackboardNodeParams<O, B>,
	) => Node<O, "blackboard", typeof params>;
	["External Task"]: <O extends object>(params: TaskNodeParams<O>) => Node<O, "task", typeof params>;
}

export const BehaviorTree: BehaviorTreeConstructor;
