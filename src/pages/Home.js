import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PageHelmet from '../components/PageHelmet';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from 'react-promise-tracker';
import * as yup from 'yup';
import _ from 'lodash';
import Swal from 'sweetalert2';
import Loader from './../utilities/Loader';
const axios = require('axios');
const CancelToken = axios.CancelToken;
const axiosCancelSource = CancelToken.source();

const Home = () => {
	const [companyDetails, setCompanyDetails] = useState(null);
	const [formFields, setFormFields] = useState(null);
	const [appSubmissionPermissionMsg, setAppSubmissionPermissionMsg] = useState('Online voting approval application not yet started');
	const { promiseInProgress } = usePromiseTracker();

	/**
	 * @method  validationSchema
	 *
	 * @type  {}
	 * @param  { }
	 * @return  {} =>{}
	 */
	const validationSchema = () => {
		let shape = {};
		_.isArray(formFields) &&
			!_.isEmpty(formFields) &&
			formFields.forEach((field) => {
				let key = field.name;
				const fieldValidate = () => {
					if (field.type === 'email') {
						if (field.required === 'true') return yup.string().email('Must be a valid email').required();
						return yup.string().email('Must be a valid email');
					} else if (field.type === 'number') {
						if (field.required === 'true')
							return yup
								.string()
								.matches(/\+?[0-9]+/gi)
								.required();
						return yup.string();
					} else if (field.type === 'text') {
						if (field.required === 'true') return yup.string().required();
						return yup.string();
					}
				};
				shape[key] = fieldValidate();
			});

		const schema = yup.object().shape(shape);
		return schema;
	};

	/**
	 * @method  resolver
	 *
	 * @type  {}
	 * @param  { }
	 * @return  {} =>{}
	 */
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(validationSchema()),
	});

	/**
	 * @method  getAppSubmissionsForm
	 *
	 * @type  {}
	 * @param  { }
	 * @return  {} =>{}
	 */
	const getAppSubmissionsForm = async () => {
		await trackPromise(
			axios
				.get('/api/application-submissions-form', {
					cancelToken: axiosCancelSource.token,
				})
				.then(function (response) {
					const data = !_.isEmpty(response.data.data) ? response.data.data : console.warn('No data to show !!');
					setFormFields(data);
				})
				.catch(function (error) {
					// handle error
					console.error(error.response);
				})
		);
	};

	/**
	 * @method  getApplicationSubmissionDetails
	 *
	 * @type  {}
	 * @param  { }
	 * @return  {} =>{}
	 */
	const getApplicationSubmissionDetails = async () => {
		await trackPromise(
			axios
				.get('/api/get-application-submission-details', {
					cancelToken: axiosCancelSource.token,
				})
				.then(function (response) {
					let { application_submission_start_date: start_date, application_submission_end_date: end_date } = response?.data?.data;

					let appSubmissionStartDate = moment(start_date, 'YYYY-MM-DD');
					let appSubmissionEndDate = moment(end_date, 'YYYY-MM-DD');

					let today = moment(moment(), 'YYYY-MM-DD');
					let isBetween = today.isBetween(appSubmissionStartDate, appSubmissionEndDate, 'days', true);

					if (isBetween === true) {
						getAppSubmissionsForm();
					} else if (today.isAfter(appSubmissionEndDate, 'date')) {
						setAppSubmissionPermissionMsg('Online voting approval application is closed ');
					} else if (today.isBefore(appSubmissionStartDate, 'date')) {
						setAppSubmissionPermissionMsg('Online voting approval application not yet started');
					}
				})
				.catch(function (error) {
					console.error(error.response);
				})
		);
	};

	/**
	 * @method  postAppSubmissionsForm
	 *
	 * @type  {}
	 * @param  { formData}
	 * @return  {} =>{}
	 */
	const postAppSubmissionsForm = async (formData) => {
		await axios
			.post('/api/application-submissions-form-store', formData, {
				cancelToken: axiosCancelSource.token,
			})
			.then(function (response) {
				// handle success
				Swal.fire({
					width: 600,
					title: 'Success',
					text: 'Thanks to apply for online voting',
					icon: 'success',
					confirmButtonColor: '#28a745',
					confirmButtonText: 'Ok',
				});
				reset();
			})
			.catch(function (error) {
				// handle error
				Swal.fire({
					width: 600,
					title: 'Error',
					text: error?.response?.data?.message ?? 'Failed !',
					icon: 'error',
					confirmButtonColor: '#f00',
					confirmButtonText: 'Ok',
				});
			});
	};

	/**
	 * @method  onSubmit
	 *
	 * @type  {}
	 * @param  { data}
	 * @return  {} =>{}
	 */
	const onSubmit = (data) => {
		postAppSubmissionsForm(data);
	};

	/**
	 * @method  getCompanyDetails
	 *
	 * @type  {}
	 * @return  {} =>{}
	 */
	const getCompanyDetails = async () => {
		await axios
			.get('/api/company-details', {
				cancelToken: axiosCancelSource.token,
			})
			.then(function (response) {
				const data = !_.isEmpty(response.data.data) ? response.data?.data : console.warn('No data to show !!');
				setCompanyDetails(data);
			})
			.catch(function (error) {
				// handle error
				console.error(error.response);
			});
	};

	/**
	 * @method { componentDIdMount}
	 * @method { componentWillUnmount}
	 *
	 * @type  {}
	 * @param  {}
	 * @return  {} =>{}
	 */
	useEffect(() => {
		getCompanyDetails();
		getApplicationSubmissionDetails();
		return () => axiosCancelSource.cancel('All axios request has been canceled.');
	}, []);

	return (
		<>
			<PageHelmet title="API E-Vote" />
			<div className="reg-for-evote py-5">
				<div className="container">
					<div className="row">
						<div className="col-xl-8 offset-xl-2">
							<div className="company-details text-center">
								{companyDetails?.icon !== undefined && !_.isEmpty(companyDetails.icon) ? (
									<img src={`${companyDetails.icon}`} style={{ maxWidth: '150px' }} alt="logo" className="img-fluid mb-3 d-inline-block" />
								) : null}
								{companyDetails?.organization !== undefined && !_.isEmpty(companyDetails.organization) ? (
									<h2 className="text-primary fs-3 fw-normal">{companyDetails.organization}</h2>
								) : null}
							</div>

							<form onSubmit={handleSubmit(onSubmit)} className="p-4 p-xl-5 text-xl-end bg-white rounded is-drop-shadow">
								<h3 className="pb-3 mb-3 lh-base mb-xl-5 text-primary border-bottom border-primary text-start fs-4 fw-normal">Registration For Online Vote</h3>
								<div id="form-body">
									{promiseInProgress === true ? (
										<Loader />
									) : _.isArray(formFields) && !_.isEmpty(formFields) ? (
										formFields.map((field, index) => {
											const { label, name, type, placeholder } = field;
											return (
												<div key={index} className="row mb-3">
													<label htmlFor={name} className="col-lg-3 col-form-label">
														{label} {index < 4 && ':'}
													</label>
													<div className="col-lg-9">
														<input
															type={type === 'number' ? 'text' : type}
															{...register(`${name}`)}
															className={`form-control rounded-pill bg-light ${errors[name] && 'is-invalid'}`}
															id={name}
															placeholder={placeholder}
														/>
														<p className="mb-0 text-start text-danger">
															<small>{errors[name]?.message}</small>
														</p>
													</div>
												</div>
											);
										})
									) : (
										<h3 className="mb-0 display-6 text-danger opacity-50 text-start">{appSubmissionPermissionMsg}</h3>
									)}
									{_.isArray(formFields) && !_.isEmpty(formFields) ? (
										<div className="row text-start mb-3">
											<div className="offset-lg-3 col-lg-9">
												<button type="submit" className="btn btn-submit rounded-pill px-4 btn-primary">
													Submit
												</button>
											</div>
										</div>
									) : null}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
