import React from 'react'
import classNames from 'classnames'
import { Graph, Node, nodeId } from '../../algorithms'
import { buildingLetter, range } from '../../utils'

import './Visualiser.css'

export interface VisualiserProps {
  graph: Graph
}

export function Visualiser(props: VisualiserProps) {
  const { graph } = props

  const [hoveredNode, setHoveredNode] = React.useState<Node | null>(null)

  return (
    <div className='visualiser'>
      {range(graph.buildings).map((buildingIdx) => {
        const building = buildingLetter(buildingIdx)
        return (
          <div className='building' key={building}>
            {range(graph.floorsPerBuilding).map((floor) => (
              <div className='floor' key={floor}>
                {range(graph.roomsPerFloor).map((room) => (
                  <div className='room' key={room}>
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
                            'portal--highlighted': highlighted,
                          })}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
