import { Graph, Node } from './generateMaze'

interface RoomPathInfo {
  /** Min distance from start */
  minDist: number

  /** Portal used to travel to this room */
  usedPortal: Node
}

interface SolverState {
  distances: { [roomId: string]: RoomPathInfo }
  graph: Graph
}

export function solveMaze(graph: Graph): SolverState {
  const state: SolverState = {
    distances: {
      [roomId(graph.start)]: {
        minDist: 0, // it takes 0 steps to be in start
        usedPortal: graph.start
      }
    },
    graph
  }

  const queue: Node[] = [graph.start]

  while (queue.length > 0) {
    const [node] = queue.splice(0) // pop
    const { graph, distances } = state

    const distanceHere = distances[roomId(node)].minDist
    const nodesInSameRoom = graph.nodes.filter((n) => {
      return isInSameRoom(node, n) && n !== node
    })

    nodesInSameRoom.forEach((siblingNode) => {
      siblingNode.connectedTo.forEach((nodeInNextRoom) => {
        const distanceIfTravel = distanceHere + 1
        const distanceThere = distances[roomId(nodeInNextRoom)]

        if (distanceThere == undefined || distanceThere.minDist > distanceIfTravel) {
          distances[roomId(nodeInNextRoom)] = {
            minDist: distanceIfTravel,
            usedPortal: siblingNode
          }

          queue.push(nodeInNextRoom)
        }
      })
    })
  }

  return state
}

export function isInSameRoom(a: Node, b: Node): boolean {
  return a.building == b.building && a.floor == b.floor && a.room == b.room
}

export function roomId(n: Node): string {
  return [n.building, n.floor, n.room].join('')
}
