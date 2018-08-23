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

//import IconButton from '@material-ui/core/IconButton'
//import MenuIcon from '@material-ui/icons/Menu'
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
    catch(e)
    {
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
            <Button color='inherit' onClick={this.loginOpen}>Login</Button>
          </Toolbar>
        </AppBar>
        <div className='container'>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' className='icon' />
          <Typography variant='title' color='inherit' className='balance'>BALANCE {this.state.balance} SVL</Typography>
          <Button color='secondary' onClick={()=>{this.fetchBlance();this.sendOpen();}} className='send' >Send</Button>
        </div>

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
          aria-labelledby="form-dialog-title"
        >
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
      </div>
    )
  }
}

export default withStyles(styles)(App)
