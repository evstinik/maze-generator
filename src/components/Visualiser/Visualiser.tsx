import React from 'react'
import classNames from 'classnames'
import { Graph, Node, roomId, solveMaze } from '../../algorithms'
import { buildingLetter, range, saveFile } from '../../utils'

import './Visualiser.css'

export interface VisualiserProps {
  graph: Graph
}

export function Visualiser(props: VisualiserProps) {
  const { graph } = props

  const [hoveredNode, setHoveredNode] = React.useState<Node | null>(null)
  const [showSolution, setShowSolution] = React.useState(false)

  const solution = React.useMemo(() => {
    const solution = solveMaze(graph)
    return solution
  }, [graph])

  const [correctPath, pathDescription] = React.useMemo(() => {
    const rooms: { [roomId: string]: number } = {} // value is a order number of a room in path

    let n: Node = solution.graph.finish
    const description: string[] = []
    while (n != solution.graph.start) {
      const rid = roomId(n)
      description.push(n.portal)
      rooms[rid] = solution.distances[rid].minDist
      n = solution.distances[rid].usedPortal
    }

    return [rooms, description.reverse().join(' -> ')]
  }, [solution])

  const exportGraph = React.useCallback(() => {
    const { graph } = solution
    const header = [graph.buildings, graph.floorsPerBuilding, graph.roomsPerFloor].join(' ')
    const startFinish = [graph.start.id, graph.finish.id].join(' ')
    const portals = graph.nodes
      .filter((n) => n.connectedTo.length > 0)
      .map((n) => `${n.id} ${n.connectedTo[0].id}`)
      .join('\n')
    const textContent = [header, startFinish, pathDescription, portals].join('\n')
    saveFile(textContent, `maze-${new Date().toISOString()}.txt`)
  }, [solution, pathDescription])

  return (
    <div className='visualiser'>
      <div className='visualiser__buildings'>
        {range(graph.buildings).map((buildingIdx) => {
          const building = buildingLetter(buildingIdx)
          return (
            <div className='building' key={building}>
              {range(graph.floorsPerBuilding).map((floor) => (
                <div className='floor' key={floor}>
                  {range(graph.roomsPerFloor).map((room) => {
                    const rid = `${building}${floor + 1}${room + 1}`
                    return (
                      <div
                        className={classNames('room', {
                          'room--highlighted': showSolution && correctPath[rid] !== undefined
                        })}
                        key={room}
                      >
                        <span className='room__number'>{rid}</span>
                        {showSolution && correctPath[rid] !== undefined && (
                          <>
                            <span className='room__step'>{correctPath[rid]}</span>
                            <span /> {/* intentianally left empty for alignment */}
                          </>
                        )}
                        {['L', 'B', 'R'].map((portal) => {
                          const node = graph.nodes.find((n) => {
                            return (
                              n.building == building && n.floor == floor + 1 && n.room == room + 1 && n.portal == portal
                            )
                          })!
                          const highlighted =
                            node === hoveredNode || (hoveredNode && node?.connectedTo.includes(hoveredNode))
                          return (
                            <div
                              key={portal}
                              onMouseEnter={() => setHoveredNode(node ?? null)}
                              onMouseLeave={() => setHoveredNode((n) => (n === node ? null : n))}
                              className={classNames(`portal portal--${portal.toLowerCase()}`, {
                                'portal--start': node?.specialConnection == 'withStart',
                                'portal--finish': node?.specialConnection == 'withFinish',
                                'portal--highlighted': highlighted
                              })}
                            />
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <div className='visualiser__options'>
        <label className='visualiser__options__option'>
          Show correct path
          <input type='checkbox' checked={showSolution} onChange={({ target }) => setShowSolution(target.checked)} />
        </label>

        <button className='button button--primary' onClick={exportGraph}>
          Export
        </button>
      </div>
    </div>
  )
}
