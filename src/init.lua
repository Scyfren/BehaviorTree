local BehaviorTree = require(script.BehaviorTree)
local BehaviorTreeCreator = require(script.BehaviorTreeCreator)

return {
    BehaviorTree = BehaviorTree,
    BehaviorTreeCreator = BehaviorTreeCreator,
    SUCCESS = 1,
    FAIL = 2,
    RUNNING = 3
}
