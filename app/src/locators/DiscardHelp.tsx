/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { LocationHelpProps, MaterialComponent, pointerCursorCss, usePlay, useRules } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { useTranslation } from 'react-i18next'

const displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const DiscardHelp = ({ location }: LocationHelpProps) => {
  const { t } = useTranslation()
  const rules = useRules<ZenithRules>()
  const cards = rules
    ?.material(MaterialType.AgentCard)
    .location(location.type)
    .sort((item) => -item.location.x!)
  const play = usePlay()
  const count = cards?.length ?? 0

  return (
    <div css={containerCss}>
      <div css={headerCss}>
        <h2 css={titleCss}>{t('help.discard.title', 'Discard pile')}</h2>
        <div css={infoBlockCss}>
          {t('help.discard.info', 'Agent cards discard pile.')} ({count})
        </div>
      </div>
      <ol css={gridCss}>
        {cards?.entries.map(([index, card]) => (
          <li key={index}>
            <MaterialComponent
              type={MaterialType.AgentCard}
              itemId={card.id}
              css={[pointerCursorCss, cardHoverCss]}
              onClick={() => play(displayMaterialHelp(MaterialType.AgentCard, card, index), { transient: true })}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}

const containerCss = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`

const headerCss = css`
  flex-shrink: 0;
`

const titleCss = css`
  color: #3e3020;
  margin-bottom: 0.5em !important;
`

const infoBlockCss = css`
  color: #5c4a3a;
  font-size: 0.92em;
  line-height: 1.55;
  padding: 0.4em 0.7em;
  margin-bottom: 1em;
  background: linear-gradient(135deg, rgba(212, 135, 42, 0.07), rgba(212, 135, 42, 0.02));
  border-left: 0.25em solid #d4872a;
  border-radius: 0 0.3em 0.3em 0;
  box-shadow: 0 0.06em 0.18em rgba(0, 0, 0, 0.06);
`

const cardHoverCss = css`
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.08);
    z-index: 1;
  }
`

const gridCss = css`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  list-style-type: none;
  gap: 1em;
  padding: 0.5em;
  margin: 0;
  font-size: 1.5em;
  flex: 1;
`
