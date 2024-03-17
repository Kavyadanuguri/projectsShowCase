import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const stages = {
  progress: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Project extends Component {
  state = {fetchedData: [], text: 'ALL', stageValue: stages.progress}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({stageValue: stages.progress})
    const {text} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${text}`
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({fetchedData: updatedData, stageValue: stages.success})
    } else {
      this.setState({stageValue: stages.failure})
    }
  }

  getInput = event => {
    this.setState({text: event.target.value}, this.getData)
  }

  onRetry = () => {
    this.getData()
  }

  renderSuccessView = () => {
    const {fetchedData} = this.state
    return (
      <ul className="ul-container">
        {fetchedData.map(each => (
          <li key={each.id} className="list-container">
            <img className="image2" alt={each.name} src={each.imageUrl} />
            <p className="p1">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="course-fail-container">
      <img
        className="fail-img"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png "
        alt="failure view"
      />
      <h1 className="course-fail-h1">Oops! Something Went Wrong</h1>
      <p className="course-fail-p">
        We cannot seem to find the page you are looking for.
      </p>
      <button onClick={this.onRetry} className="course-btn" type="button">
        Retry
      </button>
    </div>
  )

  renderProgressView = () => (
    <div className="course-fail-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderExactStage = () => {
    const {stageValue} = this.state
    switch (stageValue) {
      case stages.success:
        return this.renderSuccessView()
      case stages.failure:
        return this.renderFailureView()
      case stages.progress:
        return this.renderProgressView()
      default:
        return null
    }
  }

  render() {
    const {text, stageValue} = this.state
    console.log(stageValue)
    return (
      <div>
        <nav className="nav-container">
          <img
            className="image1"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          />
        </nav>
        <div className="container1">
          <select value={text} onChange={this.getInput} className="input1">
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderExactStage()}
        </div>
      </div>
    )
  }
}

export default Project
