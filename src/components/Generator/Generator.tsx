import React from 'react'
import { generateMaze, Graph } from '../../algorithms'
import { Visualiser } from '../Visualiser'

import './Generator.css'

export interface Configuration {
  correctPathLength: number
}

const DEFAULT_CONFIGURATION: Configuration = {
  correctPathLength: 10,
}

export function Generator() {
  const [configuration, setConfiguration] = React.useState(DEFAULT_CONFIGURATION)

  const [graph, setGraph] = React.useState<Graph | null>(null)

  const generate = React.useCallback(() => {
    setGraph(generateMaze())
  }, [])

  return (
    <>
      <div className='generator'>
        <h1>Maze Generator v1</h1>

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
        </div>

        <button className='button button--primary generator__button' onClick={generate}>
          Generate
        </button>
      </div>
      {graph && <Visualiser graph={graph} />}
    </>
  )
}
