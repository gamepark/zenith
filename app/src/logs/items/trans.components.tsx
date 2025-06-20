/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-game'
import { Faction } from '@gamepark/zenith/material/Faction'
import { ReactElement } from 'react'
import Animod from '../../images/icons/animod.jpg'
import Humanoid from '../../images/icons/humanoid.jpg'
import Robot from '../../images/icons/robot.jpg'
import Mercury from '../../images/planet/Mercury.png'
import Venus from '../../images/planet/Venus.png'
import Terra from '../../images/planet/Terra.png'
import Mars from '../../images/planet/Mars.png'
import Jupiter from '../../images/planet/Jupiter.png'
import Credit from '../../images/credit/Credit1.png'
import Zenithium from '../../images/zenithium/Zenithium.png'
import LeaderSilver from '../../images/icons/leader-silver.png'
import LeaderGold from '../../images/icons/leader-gold.png'

const pictureCss = css`
  height: 2em;
  position: relative;
  border-radius: 1em;
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

export const TransComponents: Record<string, ReactElement> = {
  animod: <Picture src={Animod} css={pictureCss} />,
  humanoid: <Picture src={Humanoid} css={pictureCss} />,
  robot: <Picture src={Robot} css={pictureCss} />,
  mercury: <Picture src={Mercury} css={pictureCss} />,
  venus: <Picture src={Venus} css={pictureCss} />,
  terra: <Picture src={Terra} css={pictureCss} />,
  mars: <Picture src={Mars} css={pictureCss} />,
  jupiter: <Picture src={Jupiter} css={pictureCss} />,
  credit: <Picture src={Credit} css={pictureCss} />,
  zenithium: <Picture src={Zenithium} css={pictureCss} />,
  leaderSilver: <Picture src={LeaderSilver} css={pictureCss} />,
  leaderGold: <Picture src={LeaderGold} css={pictureCss} />
}
