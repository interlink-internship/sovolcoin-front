import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { Keyframes, animated, config } from 'react-spring'
import delay from 'delay'
import 'antd/dist/antd.css'
import QrReader from 'react-qr-reader'
import QRCode from 'qrcode.react'

import './App.css'

const API_URI = 'https://internship-jp1.interlink.or.jp/api'

// Creates a spring with predefined animation slots
const Sidebar = Keyframes.Spring({
  // Slots can take arrays/chains,
  peek: [
    { delay: 800, from: { x: -100 }, to: { x: 0 }, config: config.slow }
  ],
  // single items,
  open: { to: { x: 0 }, config: config.default },
  // or async functions with side-effects
  close: async call => {
    await delay(400)
    await call({ to: { x: -100 }, config: config.gentle })
  }
})

class App extends React.Component
{
  constructor(props){
    super(props)

    const id = localStorage.getItem('id') || null
    const key = localStorage.getItem('key') || null

    this.state = {
      balance: 0,
      id : id,
      key: key,
      loginOpen: false,
      sendOpen: false,
    }
  }

  async componentDidMount()
  {
    this.timer = setInterval(()=> this.fetchBlance(), 5000)
  }

  componentWillUnmount()
  {
    this.timer = null
  }

  async fetchBlance()
  {
    try
    {
      const j = await fetch(`${API_URI}/getbalance/${this.state.id}`).then(x => x.json())
      this.setState({balance: j.balance})
    }
    catch(e)
    {
      console.log(e)
    }
  }

  async sendMoney(target, amount)
  {
    try
    {
      await fetch(`${API_URI}/sendmoneytoaccount/${this.state.id}/${this.state.key}/${amount}/${target}`)
    }
    catch(e)
    {
      console.log(e)
    }
  }

  loginOpen = async () =>
  {
    this.setState({ loginOpen: true })
  }

  loginClose = () =>
  {
    this.setState({ loginOpen: false })
  }

  loginHandleScan = (content) =>
  {
    if (content)
    {
      const j = JSON.parse(content)
      this.setState({id: j.id, key: j.key})
      localStorage.setItem('id', j.id)
      localStorage.setItem('key', j.key)
      this.loginClose()
    }
  }

  loginHandleError = (err) =>
  {
    console.error(err)
  }

  logout = () =>
  {
    this.setState({id: null, key: null})
    localStorage.removeItem('id')
    localStorage.removeItem('key')
  }

  sendOpen = () =>
  {
    this.setState({ sendOpen: true })
  }

  sendClose = () =>
  {
    this.sendMoney(this.state.target, this.state.amount)
    this.setState({ sendOpen: false })
  }

  sendCancel = () =>
  {
    this.setState({ sendOpen: false })
  }

  qrSendOpen = () =>
  {
    this.setState({ qrSendOpen: true })
  }

  qrSendClose = () =>
  {
    this.setState({ qrSendOpen: false })
  }

  qrSendCancel = () =>
  {
    this.setState({ qrSendOpen: false })
  }

  qrHandleScan = (content) =>
  {
    if (content)
    {
      const j = JSON.parse(content)
      this.setState({target: j.id})
      this.qrSendClose()
      this.sendOpen()
    }
  }

  qrHandleError = (err) =>
  {
    console.error(err)
  }


  render()
  {

    const {classes} = this.props
    const state = this.state.open === undefined ? 'peek' : this.state.open ? 'open' : 'close'
    return (
      <Fragment>
        <div className="title">
          <div className="center">
              <img src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' className='icon' />
          </div>
        </div>

        <Sidebar native state={state}>
          {({ x }) => (
              <animated.div className="sideBar" style={{ transform: x.interpolate(x => `translate3d(${x}%,0,0)`) }}>
                <div className="contents">
                  <Typography variant='headline' color='inherit' align='center' className='userID'>SovolCoin</Typography>

                  <div className="switch">
                    {(()=>{
                      if (this.state.id != null)
                      {
                          return <React.Fragment className="switchBox">
                             <div className="stringGroup">
                              <Typography variant='headline' color='inherit' align='center' className='userID'>ID: {this.state.id} </Typography>
                            </div>
                              <div className="qrCodeBox">
                                <QRCode className="qrCode" renderAs='svg' value={JSON.stringify({id: this.state.id, key: this.state.key})} />
                              </div>
                              <div className="logoutBox">
                                <Button className="logio" variant="outlined" color="primary" style={{marginTop: '1vw'}} onClick={this.logout}>Logout</Button>
                              </div>
                            </React.Fragment>
                      }
                      else
                      {
                        return <React.Fragment className="switchBox">
                                <div className="stringGroup"><Typography variant='headline' color='inherit' align='center' className='emptyUserId'>&nbsp;</Typography></div>
                                <div className="emptyQrCodeBox">
                                </div>
                                <Button className="logio" variant="outlined" color="secondary" onClick={this.loginOpen}>
                                  Login
                                </Button>
                              </React.Fragment>
                      }
                    })()}
                  </div>

                  <div className="info">
                  {(() =>
                  {
                    if (this.state.id != null)
                    {
                      return  <React.Fragment className="infoBox">
                          <div className="stringGroup">
                            <Typography variant='title' color='textPrimary' align='center' className='balance'>{this.state.balance} SVC</Typography>
                          </div>
                          <div className="buttonGroup">
                            <Button className="button" variant="outlined" style={{width: '48%', float: 'left'}} color="primary" onClick={this.qrSendOpen} >QR Pay</Button>
                            <Button className="button" variant="outlined" style={{width: '48%', float: 'right'}} color="secondary" onClick={this.sendOpen} >Send</Button>
                          </div>
                        </React.Fragment>
                    } else {
                      return <React.Fragment className="infoBox">
                      </React.Fragment>
                    }
                  })()}
                  </div>
                </div>
              </animated.div>
            )}
        </Sidebar>

         <Dialog
          open={this.state.sendOpen}
          onClose={this.sendClose}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          autoDetectWindowHeight={false} 
          autoScrollBodyContent={false}>
          <DialogTitle id="form-dialog-title">Transfer</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              id='target'
              label='target'
              type='text'
              fullWidth
              value={this.state.target}
              onChange={(e) => this.setState({target: e.target.value})}
            />
            <TextField
              autoFocus
              margin='dense'
              id='amount'
              label='amount'
              type='number'
              fullWidth
              value={this.state.amount}
              onChange={(e) => this.setState({amount: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.sendCancel} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.sendClose} color='primary'>
              Send
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.qrSendOpen}
          onClose={this.qrSendClose}
          aria-labelledby="form-dialog-title"
          style={{width: '100%', height: '100%'}}
          fullWidth={true}
          autoDetectWindowHeight={false} 
          autoScrollBodyContent={false}
          >
          <DialogTitle id="form-dialog-title">QR Pay</DialogTitle>
          <DialogContent>
            <QrReader
              className='qrReader'
              delay={500}
              onError={this.qrHandleError}
              onScan={this.qrHandleScan}
              style={{width: '100%', height: '100%'}}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.qrSendClose} color='primary'>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.loginOpen}
          onClose={this.loginClose}
          modal = {true}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          autoDetectWindowHeight={false} 
          autoScrollBodyContent={false}
          >
          <DialogTitle id="form-dialog-title">Login</DialogTitle>
          <DialogContent>
            <QrReader
              delay={500}
              onError={this.loginHandleError}
              onScan={this.loginHandleScan}
              />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.loginClose} color='primary'>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  }
}

export default App
