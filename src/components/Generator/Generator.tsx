import React from 'react'
import { generateMaze, Graph } from '../../algorithms'
import { Visualiser } from '../Visualiser'

import './Generator.css'

export interface Configuration {
  buildings: number
  floors: number
  rooms: number
  correctPathLength: number
}

const DEFAULT_CONFIGURATION: Configuration = {
  buildings: 2,
  floors: 5,
  rooms: 3,
  correctPathLength: 10
}

export function Generator() {
  const [configuration, setConfiguration] = React.useState(DEFAULT_CONFIGURATION)

  const [graph, setGraph] = React.useState<Graph | null>(null)

  const generate = React.useCallback(() => {
    setGraph(
      generateMaze(configuration.correctPathLength, configuration.buildings, configuration.floors, configuration.rooms)
    )
  }, [configuration])

  return (
    <>
      <div className='generator'>
        <h1>Maze Generator v1</h1>

        {!graph && (
          <div className='configuration'>
            <label className='configuration__item'>
              Correct path length
              <input
                className='configuration__input'
                type='number'
                value={configuration.correctPathLength}
                onChange={({ target }) => setConfiguration((c) => ({ ...c, correctPathLength: Number(target.value) }))}
              />
            </label>

            <label className='configuration__item'>
              Buildings
              <input
                className='configuration__input'
                type='number'
                value={configuration.buildings}
                onChange={({ target }) => setConfiguration((c) => ({ ...c, buildings: Number(target.value) }))}
              />
            </label>

            <label className='configuration__item'>
              Floors per building
              <input
                className='configuration__input'
                type='number'
                value={configuration.floors}
                onChange={({ target }) => setConfiguration((c) => ({ ...c, floors: Number(target.value) }))}
              />
            </label>

            <label className='configuration__item'>
              Rooms per floor
              <input
                className='configuration__input'
                type='number'
                value={configuration.rooms}
                onChange={({ target }) => setConfiguration((c) => ({ ...c, rooms: Number(target.value) }))}
              />
            </label>
          </div>
        )}

        {graph && (
          <button className='button button--secondary' onClick={() => setGraph(null)}>
            Edit parameters
          </button>
        )}

        <button className='button button--primary generator__button' onClick={generate}>
          Generate{graph ? ' more' : ''}
        </button>
      </div>

      {graph && <Visualiser graph={graph} />}
    </>
  )
}
