import React, { Component } from 'react'
import { cx, css } from 'emotion'

import appstyles from '../styles'
import { parsePwd, parseGit } from '../utils'

const styles = {
  termHeader: css`
    margin-right: -10px;
    padding: 1px;
    color: #f8f8f2;
    flex: 1;
    height: 25px;
    background: hsl(231, 15%, 18%);
    clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%);
  `,
  termHeaderInner: css`
    padding: 0 20px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    direction: rtl;
    background: hsl(231, 15%, 28%);
    clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%);
    transition: background 0.1s;
  `,
  termHeaderActive: css`
    background: hsl(231, 15%, 18%);
    z-index: 1;
  `,
  termHeaderInnerActive: css`
    background: hsl(231, 15%, 18%);
  `,
  termHeaderText: css`
    opacity: 0;
    transition: opacity 0.5s;
  `,
  termHeaderTextVisible: css`
    opacity: 1;
  `
}

export default class TermHeader extends Component {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount = () => {
    const { ses } = this.props

    ses.on('pwd', this.setPwd)
    ses.on('cmd', this.setCmd)
    ses.on('git', this.setGit)
  }

  setPwd = pwd => this.setState({ pwd })
  setCmd = cmd => this.setState({ cmd })
  setGit = git => this.setState({ git })

  componentWillUnmount = () => {
    ses.removeListener(pwd, this.setPwd)
    ses.removeListener(cmd, this.setCmd)
    ses.removeListener(git, this.setGit)
  }

  render() {
    const { ses, active, visible, onClick } = this.props
    const { pwd, cmd, git } = this.state

    return (
      <div
        className={cx(styles.termHeader, { [styles.termHeaderActive]: active })}
        key={ses.pty.pid}
        onClick={onClick}>
        <div
          className={cx(styles.termHeaderInner, {
            [styles.termHeaderInnerActive]: active
          })}>
          <span className={cx(styles.termHeaderText, { [styles.termHeaderTextVisible]: visible })}>
            {
              // Hack to get consistency from direction: ltr for cwd ~ and /
              // without this single no word chars break the text direction :?
              <span style={{ visibility: 'hidden', fontSize: '0' }}>'abc'</span>
            }
            <span>{parsePwd(pwd || '')} </span>
            {git && (
              <span>
                <span className={appstyles.cyan}>({parseGit(git)})</span>
              </span>
            )}
            <span className={appstyles.blue}> - </span>
            {cmd || ses.pty.process}
          </span>
        </div>
      </div>
    )
  }
}