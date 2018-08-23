import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { Keyframes, animated, config } from 'react-spring'
import delay from 'delay'
import 'antd/dist/antd.css'
import './App.css'

const API_URI = 'http://internship-jp1.interlink.or.jp/api'
const fast = { ...config.stiff, restSpeedThreshold: 1, restDisplacementThreshold: 0.01 }

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
    this.state = {
      balance: 200,
      immatureBalance: 50,
      loginOpen: false,
      sendOpen: false
    }
  }

  async fetchBlance(e)
  {
    try
    {
      localStorage.setItem('id', 'itleigns')
      const id = localStorage.getItem('id')
      console.log(id)
      const j = await fetch(`${API_URI}/getbalance/${id}`).then(x => x.json())
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
      localStorage.setItem('id', 'itleigns')
      const id = localStorage.getItem('id')
      console.log(id)
      const j = await fetch(`${API_URI}/sendmoney/${id}/${this.state.key}/${amount}/${target}`).then(x => x.json())
      this.setState({balance: j.balance})
    }
    catch(e){
      console.log(e)
    }
  }

  loginOpen = () =>
  {
    this.setState({ loginOpen: true })
  }

  loginClose = () =>
  {
    this.setState({ loginOpen: false })
  }

  sendOpen = () =>
  {
    this.setState({ sendOpen: true })
  }

  sendClose = () =>
  {
    console.log(this.state.amount)
    console.log(this.state.id)
    this.setState({ sendOpen: false })
  }
  update = () => {
    console.log('onUpdate')
    this.setState({updateTime: new Date().getSeconds()})
  }

  state = { open: undefined, updateTime: new Date().getSeconds() }
  toggle = () => this.setState(state => ({ open: !state.open }))
  render() {
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
                  <p>{this.state.balance}</p>
                  <p>{this.state.updateTime}</p>
                  <Button color='secondary' onClick={()=>{this.fetchBlance();this.sendOpen();}} className='send' >Send</Button>
                  <Button color='inherit' onClick={this.loginOpen}>Login</Button>
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
              id='id'
              label='id'
              type='text'
              fullWidth
              value={this.state.id}
              onChange={(e) => this.setState({id: e.target.value})}
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
            <Button onClick={this.sendClose} color='primary'>
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
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We will send
              updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="ID"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.loginClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.loginClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>    
      </Fragment>
    )
  }
}

export default App


/*
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='title' color='inherit' className={classes.flex}>
                SovoloCoin
            </Typography>
            <Button color='inherit' onClick={this.loginOpen}>Login</Button>
          </Toolbar>
        </AppBar>
        <div className='container'>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' className='icon' />
          <Typography variant='title' color='inherit' className='balance'>BALANCE {this.state.balance} SVL</Typography>
          <Button color='secondary' onClick={()=>{this.fetchBlance();this.sendOpen();}} className='send' >Send</Button>
        </div>

       


      </div>
*/