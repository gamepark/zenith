/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-game'
import { Faction } from '@gamepark/zenith/material/Faction'
import { Influence } from '@gamepark/zenith/material/Influence'
import { ReactElement } from 'react'
import Credit from '../images/credit/Credit1.png'
import Animod from '../images/icons/animod.jpg'
import Humanoid from '../images/icons/humanoid.jpg'
import LeaderGold from '../images/icons/leader-gold.png'
import LeaderSilver from '../images/icons/leader-silver.png'
import Robot from '../images/icons/robot.jpg'
import Jupiter from '../images/planet/Jupiter.png'
import Mars from '../images/planet/Mars.png'
import Mercury from '../images/planet/Mercury.png'
import Terra from '../images/planet/Terra.png'
import Venus from '../images/planet/Venus.png'
import Zenithium from '../images/zenithium/Zenithium.png'

export const pictureCss = (jpg?: boolean) => css`
  height: 2em;
  position: relative;
  border-radius: ${jpg ? 1 : 0}em;
  box-shadow: ${jpg ? '0 0 0.1em black, 0 0 0.1em black;' : 'none'};
  margin-left: 0.2em;
  margin-right: 0.2em;
  picture,
  img {
    padding: 0;
    margin: 0;
    vertical-align: middle;
  }
`

export const getFactionIcon = (faction: Faction) => {
  switch (faction) {
    case Faction.Animod:
      return TransComponents.animod
    case Faction.Human:
      return TransComponents.humanoid
    case Faction.Robot:
      return TransComponents.robot
  }
}

export const getPlanet = (influence: Influence) => {
  switch (influence) {
    case Influence.Mercury:
      return TransComponents.mercury
    case Influence.Venus:
      return TransComponents.venus
    case Influence.Terra:
      return TransComponents.terra
    case Influence.Jupiter:
      return TransComponents.jupiter
    case Influence.Mars:
      return TransComponents.mars
  }
}

export const getColorForInfluence = (influence?: Influence) => {
  if (!influence) return
  switch (influence) {
    case Influence.Mercury:
      return '#70658e'
    case Influence.Venus:
      return '#a55f16'
    case Influence.Terra:
      return '#08779c'
    case Influence.Mars:
      return '#CA555D'
    case Influence.Jupiter:
      return '#53A49B'
  }
}

export const TransComponents: Record<string, ReactElement> = {
  animod: <Picture src={Animod} css={pictureCss(true)} />,
  humanoid: <Picture src={Humanoid} css={pictureCss(true)} />,
  robot: <Picture src={Robot} css={pictureCss(true)} />,
  mercury: <Picture src={Mercury} css={pictureCss()} />,
  venus: <Picture src={Venus} css={pictureCss()} />,
  terra: <Picture src={Terra} css={pictureCss()} />,
  mars: <Picture src={Mars} css={pictureCss()} />,
  jupiter: <Picture src={Jupiter} css={pictureCss()} />,
  credit: <Picture src={Credit} css={pictureCss()} />,
  zenithium: <Picture src={Zenithium} css={pictureCss()} />,
  leaderSilver: <Picture src={LeaderSilver} css={pictureCss()} />,
  leaderGold: <Picture src={LeaderGold} css={pictureCss()} />,
  bold: <strong />,
  italic: <i />
}
