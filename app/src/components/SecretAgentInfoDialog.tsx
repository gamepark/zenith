/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-game'
import { Agent, secretAgents } from '@gamepark/zenith/material/Agent'
import { Agents } from '@gamepark/zenith/material/Agents'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { agentCardDescription } from '../material/AgentCardDescription'

const sortedSecretAgents = [...secretAgents].sort((a, b) => Agents[a].cost - Agents[b].cost || Agents[a].influence - Agents[b].influence)
const freeAgents = sortedSecretAgents.filter(a => Agents[a].cost === 0)
const costAgents = sortedSecretAgents.filter(a => Agents[a].cost > 0)

type Props = {
  onClose: () => void
}

export const SecretAgentInfoDialog: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation()
  return (
    <div css={overlayCss} onClick={onClose}>
      <div css={dialogCss} onClick={e => e.stopPropagation()}>
        <h2 css={titleCss}>{t('extension.title', 'Secret Agent')}</h2>
        <p css={introCss}>{t('extension.intro', 'This game includes the Secret Agent expansion!')}</p>

        <div css={sectionCss}>
          <div css={sectionHeaderCss}>
            {t('extension.setup.title', 'Setup')}
            <span css={sectionLineCss} />
          </div>
          <div css={blockCss}>
            {t('extension.setup.desc', 'The 10 new Secret Agent cards are shuffled into the Agent deck.')}
          </div>
        </div>

        <div css={sectionCss}>
          <div css={sectionHeaderCss}>
            {t('extension.new.title', 'New agents')}
            <span css={sectionLineCss} />
          </div>
          <div css={blockCss}>
            {t('extension.new.desc', '5 agents have a cost of 0 credits. The other 5 cost 5 credits and their effects take into account the opponent\'s resources (leader badge, credits, zenithium).')}
          </div>
        </div>

        <div css={cardsContainerCss}>
          <div css={cardsGridCss}>
            {freeAgents.map((agent: Agent) => (
              <Picture key={agent} src={agentCardDescription.images[agent]} css={cardCss} />
            ))}
            {costAgents.map((agent: Agent) => (
              <Picture key={agent} src={agentCardDescription.images[agent]} css={cardCss} />
            ))}
          </div>
        </div>

        <button css={closeBtnCss} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  )
}

const overlayCss = css`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const dialogCss = css`
  background: linear-gradient(135deg, #f8f2e8 0%, #f0e8d8 100%);
  border-radius: 0.6em;
  box-shadow: 0 0.7em 3em rgba(0, 0, 0, 0.7),
    0 0 0 0.12em rgba(212, 135, 42, 0.4),
    0 0 0 0.3em rgba(40, 25, 10, 0.6);
  color: #3e3020;
  padding: 2em 2.5em;
  max-width: 40em;
  font-size: calc(2.5em * var(--gp-scale, 1));
  animation: slideUp 0.3s ease;
  @keyframes slideUp {
    from { transform: translateY(1em); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`

const titleCss = css`
  margin: 0 0 0.3em;
  font-size: 1.5em;
  font-weight: 700;
  color: #2d1a0a;
  text-align: center;
`

const introCss = css`
  margin: 0 0 1em;
  color: #5c4a3a;
  font-size: 0.95em;
  line-height: 1.4;
  text-align: center;
`

const sectionCss = css`
  margin-bottom: 0.8em;
`

const sectionHeaderCss = css`
  font-size: 0.8em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #3e3020;
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.3em;
`

const sectionLineCss = css`
  flex: 1;
  height: 0.12em;
  background: linear-gradient(90deg, #d4872a 0%, rgba(212, 135, 42, 0.2) 50%, transparent 100%);
  border-radius: 0.06em;
`

const blockCss = css`
  color: #5c4a3a;
  font-size: 0.9em;
  line-height: 1.5;
  padding: 0.4em 0.7em;
  background: linear-gradient(135deg, rgba(212, 135, 42, 0.07), rgba(212, 135, 42, 0.02));
  border-left: 0.25em solid #d4872a;
  border-radius: 0 0.3em 0.3em 0;
`

const cardsContainerCss = css`
  margin-top: 0.5em;
  padding: 0.5em 0;
`

const cardsGridCss = css`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.4em;
  justify-items: center;
`

const cardCss = css`
  width: 100%;
  border-radius: 0.3em;
  box-shadow: 0 0.1em 0.4em rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.05);
    z-index: 1;
  }
`

const closeBtnCss = css`
  display: block;
  margin: 1em auto 0;
  font-size: 1em;
  font-weight: 700;
  background: linear-gradient(135deg, #d4872a, #b87020);
  color: #fff;
  border: none;
  border-radius: 0.4em;
  box-shadow: 0 0.12em 0.35em rgba(0, 0, 0, 0.4);
  padding: 0.4em 2em;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: linear-gradient(135deg, #e09530, #c87828);
    transform: translateY(-0.06em);
    box-shadow: 0 0.25em 0.7em rgba(212, 135, 42, 0.3);
  }
`
