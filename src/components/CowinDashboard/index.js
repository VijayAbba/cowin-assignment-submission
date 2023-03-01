// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  pending: 'PENDING',
}

class CowinDashboard extends Component {
  state = {
    apiStatusDetails: apiStatus.initial,
    dataDetails: {},
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatusDetails: apiStatus.pending})

    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    const data = await response.json()

    if (response.ok === true) {
      const updateData = {
        preVaccinationCoverage: data.last_7_days_vaccination,
        preVaccinationByAge: data.vaccination_by_age,
        preVaccinationByGender: data.vaccination_by_gender,
      }

      const {
        preVaccinationCoverage,
        preVaccinationByAge,
        preVaccinationByGender,
      } = updateData
      const updatedVaccinationCoverage = preVaccinationCoverage.map(
        eachItem => ({
          dose1: eachItem.dose_1,
          dose2: eachItem.dose_2,
          vaccineDate: eachItem.vaccine_date,
        }),
      )

      this.setState({
        dataDetails: {
          updatedVaccinationCoverage,
          preVaccinationByAge,
          preVaccinationByGender,
        },
        apiStatusDetails: apiStatus.success,
      })
    } else if (response.ok === false) {
      this.setState({apiStatusDetails: apiStatus.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderDetails = () => {
    const {dataDetails} = this.state
    const {
      updatedVaccinationCoverage,
      preVaccinationByAge,
      preVaccinationByGender,
    } = dataDetails

    return (
      <div className="all-cards">
        <div className="vacation-card">
          <VaccinationCoverage details={updatedVaccinationCoverage} />
        </div>
        <VaccinationByGender details={preVaccinationByGender} />
        <VaccinationByAge details={preVaccinationByAge} />
      </div>
    )
  }

  renderFailure = () => (
    <div className="">
      <img
        className=""
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="">Something went wrong</h1>
    </div>
  )

  renderFinal = () => {
    const {apiStatusDetails} = this.state
    switch (apiStatusDetails) {
      case apiStatus.success:
        return this.renderDetails()
      case apiStatus.failure:
        return this.renderFailure()
      case apiStatus.pending:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin-container">
        <div className="logo-card">
          <img
            className="logo-img"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1 className="logo-heading">Co-WIN</h1>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>

        {this.renderFinal()}
      </div>
    )
  }
}

export default CowinDashboard
