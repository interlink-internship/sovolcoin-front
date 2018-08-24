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
import Instascan from 'instascan'
import QRCode from 'qrcode.react'

import './App.css'

const API_URI = 'http://internship-jp1.interlink.or.jp/api'

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

class App extends React.Component {
  constructor(props){
    super(props)

    const id = localStorage.getItem('id') || null
    const key = localStorage.getItem('key') || null

    this.state = {
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

  componentWillUnmount() {
    this.timer = null
  }

  async fetchBlance()
  {
    try
    {
      //localStorage.setItem('id', 'itleigns')
      //const id = localStorage.getItem('id')
      //console.log(id)
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
      //localStorage.setItem('id', 'itleigns')
      //const id = localStorage.getItem('id')
      //console.log(id)
      console.log(`${API_URI}/sendmoneytoaccount/${this.state.id}/${this.state.key}/${amount}/${target}`)
      await fetch(`${API_URI}/sendmoneytoaccount/${this.state.id}/${this.state.key}/${amount}/${target}`)
      //this.setState({balance: j.balance})
    }
    catch(e){
      console.log(e)
    }
  }

  loginOpen = async () =>
  {
    try
    {
      this.setState({ loginOpen: true })

      const cameras = await Instascan.Camera.getCameras()
      if (cameras.length === 0)
      {
        console.error('No cameras found.')
        return
      }

      const scanner = new Instascan.Scanner({ video: document.getElementById('preview') })
      scanner.addListener('scan', (content) =>
      {
        const j = JSON.parse(content)
        this.setState({id: j.id, key: j.key})
        localStorage.setItem('id', j.id)
        localStorage.setItem('key', j.key)
        this.loginClose()
      })
      scanner.start(cameras[0])
      this.scanner = scanner
    }
    catch(e)
    {
      console.log(e)
    }
  }

  loginClose = () =>
  {
    if (this.scanner)
    {
      this.scanner.stop()
      this.scanner = null
    }
    this.setState({ loginOpen: false })
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
  update = () => {
    console.log('onUpdate')
    this.setState({updateTime: new Date().getSeconds()})
  }

  state = { open: undefined, updateTime: new Date().getSeconds() }
  toggle = () => this.setState(state => ({ open: !state.open }))

  loginClose = () =>
  {
    if (this.scanner)
    {
      this.scanner.stop()
      this.scanner = null
    }
    this.setState({ loginOpen: false })
  }

  logout = () =>
  {
    this.setState({id: null, key: null})
    localStorage.setItem('id', null)
    localStorage.setItem('key', null)
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

  render()
  {
    const {classes} = this.props
    const state = this.state.open === undefined ? 'peek' : this.state.open ? 'open' : 'close'
    setInterval(this.update, 1000);
    return (
      <Fragment>
        <div className="title">
          <div className="center">
              <img src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' className='icon' />
              <p className="text" > Sovol Coin </p>
          </div>
        </div>

        <Sidebar native state={state}>
          {({ x }) => (
              <animated.div className="sideBar" style={{ transform: x.interpolate(x => `translate3d(${x}%,0,0)`) }}>
                <div className="contents">
                  <div className="switch">
                    {(()=>{
                      if (this.state.id != null)
                      {
                        return <Button color='inherit' onClick={this.logout}>Logout</Button>
                      }
                      else
                      {
                        return <Button color='inherit' onClick={this.loginOpen}>Login</Button>
                      }
                  })()}
                  </div>
                  {(() =>
                  {
                    if (this.state.id != null)
                    {
                      return (
                        <div>
                        <QRCode value={JSON.stringify({id: this.state.id, key: this.state.key})} />
                        <Typography variant='title' color='inherit' className='userID'>ID {this.state.id} </Typography>
                        <Typography variant='title' color='inherit' className='balance'>BALANCE {this.state.balance} SVC</Typography>
                        <Button color='secondary' onClick={()=>{this.fetchBlance();this.sendOpen();}} className='send' >Send</Button>
                        </div>
                      )
                    }
                  })()}
                </div>
              </animated.div>
            )}
        </Sidebar>

         <Dialog
          open={this.state.sendOpen}
          onClose={this.sendClose}
          aria-labelledby="form-dialog-title">
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
          open={this.state.loginOpen}
          onClose={this.loginClose}
          aria-labelledby="form-dialog-title">

          <DialogTitle id="form-dialog-title">Login</DialogTitle>
          <DialogContent>
            <video id='preview' autoPlay className="active"></video>
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