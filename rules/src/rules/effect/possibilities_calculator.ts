export interface Planet {
  id: number
  location: {
    x: number
  }
}

export interface Move {
  planetId: number
  move: number
}

type Pattern = number[]

export const calculateMoves = (planetToMove: Planet, planets: Planet[], pattern: Pattern, prevMoves: Move[]) => {
  const possibilities: Planet[] = []

  pattern.forEach((move, index) => {
    let isNeighbourMoved = false
    let neighbourMove = 0
    const neighbourId = index && planetToMove.id !== 0 ? planetToMove.id - 1 : planetToMove.id + 1
    const neighbourExists = planets.find((planet) => planet.id === neighbourId)

    prevMoves.forEach((prevMove) => {
      if (prevMove.planetId === neighbourId) {
        isNeighbourMoved = true
        neighbourMove = prevMove.move
      }
    })

    if (!isNeighbourMoved && neighbourExists) {
      const newPos = planetToMove.location.x + move
      if (newPos >= 0 && newPos <= 4) {
        const movedPlanet = { ...planetToMove, location: { x: planetToMove.location.x + move } }
        possibilities.push(movedPlanet)
      }
      return
    }

    if (isNeighbourMoved) {
      let expectedMove

      if (move > 0) {
        expectedMove = neighbourMove - 1
      } else if (move < 0) {
        expectedMove = neighbourMove + 1
      }

      if (expectedMove === move) {
        const newPos = planetToMove.location.x + move
        if (newPos >= 0 && newPos <= 4) {
          const movedPlanet = { ...planetToMove, location: { x: planetToMove.location.x + move } }
          possibilities.push(movedPlanet)
        }
      }
    }
  })

  return possibilities
}
