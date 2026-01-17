/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Mercury from '../images/planet/Mercury.png'
import Venus from '../images/planet/Venus.png'
import Terra from '../images/planet/Terra.png'
import Mars from '../images/planet/Mars.png'
import Jupiter from '../images/planet/Jupiter.png'

const planets = [
  { name: 'planet.1', image: Mercury },
  { name: 'planet.2', image: Venus },
  { name: 'planet.3', image: Terra },
  { name: 'planet.4', image: Mars },
  { name: 'planet.5', image: Jupiter }
]

export const PlanetBoardHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = () => {
  const { t } = useTranslation()

  return (
    <div css={containerCss}>
      <div css={titleCss}>{t('help.planet-board.title')}</div>
      <div css={descCss}>{t('help.planet-board.desc')}</div>

      <div css={planetsCss}>
        {planets.map((planet, i) => (
          <div key={i} css={planetRowCss}>
            <Picture src={planet.image} css={planetIconCss} />
            <span>{t(planet.name)}</span>
          </div>
        ))}
      </div>

      <div css={victorySection}>
        <div css={victoryTitleCss}>{t('help.planet-board.victory')}</div>
        <ul css={victoryListCss}>
          <li>{t('help.planet-board.victory.absolute')}</li>
          <li>{t('help.planet-board.victory.democratic')}</li>
          <li>{t('help.planet-board.victory.popular')}</li>
        </ul>
      </div>
    </div>
  )
}

const containerCss = css`
  min-width: 18em;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`

const titleCss = css`
  font-size: 1.2em;
  font-weight: 700;
  color: #1f2937;
`

const descCss = css`
  font-size: 0.95em;
  color: #374151;
  line-height: 1.4;
`

const planetsCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
`

const planetRowCss = css`
  display: flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.3em 0.6em;
  background: #f3f4f6;
  border-radius: 0.4em;
  font-size: 0.9em;
`

const planetIconCss = css`
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
`

const victorySection = css`
  margin-top: 0.5em;
  padding-top: 0.8em;
  border-top: 1px solid #e5e7eb;
`

const victoryTitleCss = css`
  font-size: 0.95em;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.4em;
`

const victoryListCss = css`
  margin: 0;
  padding-left: 1.2em;
  font-size: 0.9em;
  color: #374151;
  line-height: 1.5;
`
