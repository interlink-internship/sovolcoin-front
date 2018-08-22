import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
//import IconButton from '@material-ui/core/IconButton'
//import MenuIcon from '@material-ui/icons/Menu'
import './App.css'

const API_URI = 'http://localhost:8080'
//const API_URI = 'http://internship-jp1.interlink.or.jp/getbalance/leign'

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
    }
  }

  async fetchBlance(e)
  {
    //try
    //{
    //  const j = await fetch(`${API_URI}/getPeers`).then(x => x.json())
    //  this.setState({balance: j.balance, immatureBalance: j.immatureBalance})
    //}
    //catch(e)
    //{
    //  console.log(e)
    //}

    try
    {
      const j = await fetch('http://internship-jp1.interlink.or.jp/getbalance/itleigns').then(x => x.json())
      this.setState({balance: j.balance})
    }
    catch(e)
    {
      console.log(e)
    }
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
            <Button color='inherit'>Login</Button>
          </Toolbar>
        </AppBar>
        <div className='container'>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' className='icon' />
          <Typography variant='title' color='inherit' className='balance'>BALANCE {this.state.balance} SVL</Typography>
          <Button color='secondary' onClick={()=>this.fetchBlance()} className='send' >Send</Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(App)
