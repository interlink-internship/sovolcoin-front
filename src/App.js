import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Instascan from 'instascan'
import QRCode from 'qrcode.react'

import './App.css'

const API_URI = 'http://internship-jp1.interlink.or.jp/api'

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}


class App extends React.Component {

  constructor(props)
  {
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
      const j = await fetch(`${API_URI}/sendmoneytoaccount/${this.state.id}/${this.state.key}/${amount}/${target}`).then(x => x.json())
      console.log(`${API_URI}/sendmoneytoaccount/${this.state.id}/${this.state.key}/${amount}/${target}`)
      //this.setState({balance: j.balance})
    }
    catch(e)
    {
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

  sendCancel = () =>
  {
    this.setState({ sendOpen: false })
  }

  render()
  {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='title' color='inherit' className={classes.flex}>
                SovoloCoin
            </Typography>
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
          </Toolbar>
        </AppBar>
        {(() =>
        {
          if (this.state.id != null)
          {
            return (
              <div>
              <QRCode value={JSON.stringify({id: this.state.id, key: this.state.key})} />
              <Typography variant='title' color='inherit' className='balance'>BALANCE {this.state.balance} SVC</Typography>
              <Button color='secondary' onClick={()=>{this.fetchBlance();this.sendOpen();}} className='send' >Send</Button>
              </div>
            )
          }
        })()}

        <Dialog
          open={this.state.sendOpen}
          onClose={this.sendClose}
          aria-labelledby="form-dialog-title"
        >
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
          aria-labelledby="form-dialog-title"
        >
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

      </div>
    )
  }
}

export default withStyles(styles)(App)
