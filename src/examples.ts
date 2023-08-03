import { BehaviorTree, FAIL, RUNNING, SUCCESS } from "@rbxts/behavior-tree";

interface MyFirstInterface {
	i: number | undefined;
}

const NewNode1 = BehaviorTree.Task<MyFirstInterface>({
	// 'start' and 'finish' functions are optional. only "run" is required!

	start: (object, ...args) => {
		object.i = 0;
		print("I've prepped the task!");
		print("I got some start data too: " + (args as [string])[0]);
	},

	run: (object) => {
		object.i = (object.i as number) + 1;
		if (object.i === 5) return SUCCESS;
		else if (object.i > 5) return FAIL;

		print("The task is still running...");
		return RUNNING;
	},

	finish: (object, status) => {
		object.i = undefined;
		print("I'm done with the task! My outcome was: ");
		if (status === SUCCESS) print("Success!");
		else if (status === FAIL) print("Fail!");
	},
});

const myFirstTree = new BehaviorTree<MyFirstInterface>({
	tree: NewNode1,
});

let myFirstTreeStatus;
const obj = { i: undefined };
do {
	print(obj);
	myFirstTreeStatus = myFirstTree.run(obj, "Some run data");
} while (myFirstTreeStatus === RUNNING);

const node1 = BehaviorTree.Task({
	weight: 10,
	run: () => {
		print("I am node1");
		return SUCCESS;
	},
});

const node2 = BehaviorTree.Task({
	weight: 10,
	run: () => {
		print("I am node2");
		return SUCCESS;
	},
});

const node3 = BehaviorTree.Task({
	weight: 200,
	run: () => {
		print(`I am node3`);
		return SUCCESS;
	},
});

const Sequence = BehaviorTree.Sequence({
	nodes: [
		node1,
		node2, // if this failed, the next step would process node1
		node3,
	],
});

const Priority = BehaviorTree.Selector({
	nodes: [
		node1,
		node2,
		node3, // this is the only node that suceeded, so Priority would return success
	],
});

const Random = BehaviorTree.Random({
	nodes: [node1, node2, node3],
});

const Invert = BehaviorTree.Invert({
	nodes: [node1],
});

const Repeat = BehaviorTree.Repeat({
	nodes: [node1],
	count: 3,
	breakonfail: true,
});

const RandomTree = new BehaviorTree({
	tree: BehaviorTree.Random({
		nodes: [
			node1,
			node2,
			node3,
			// node4
		],
	}),
});

let x = 0;
while (x < 20) {
	RandomTree.run({});
	wait(0.1);
	x++;
}

const crazyNode = BehaviorTree.Task({
	weight: 200,
	run: () => {
		if (math.random(1, 10) === 1) return FAIL;
		else return SUCCESS;
	},
});

const sequenceTree = new BehaviorTree({
	tree: BehaviorTree.Sequence({ nodes: [node1, node2, crazyNode, node3] }),
});

const a = true;
while (a) {
	print(sequenceTree.run(obj));
	wait(1);
}
