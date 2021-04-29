import axios from 'axios';


const ngrokID = 'c4a827e90fcc'
const route_api = 'https://' + ngrokID + '.ngrok.io'
const newRoute = "http://40.123.255.174"
const instance = axios.create({
	baseURL: `${newRoute}/api`,
	timeout: 5000,
	headers: {
		authorization: "Bearer " + localStorage.getItem('admin-token')
	}


});

const adminApi = {
	route: `${route_api}/api`,
	instance,
	notify: (message, type) => {
		window.$.notify({
			// options
			message
		}, {
			// settings	
			type,
			delay: 3000,
		});
	},
	login: (params) => instance.post('/v1/users/login', params),
	loadAdminDashboard: () => instance.get('/dashboard/info'),
	logout: () => instance.get('/user/logout'),


	// API for Cainet Model
	getCabitnet: () => instance.get('/v1/cabinets'),
	updateCabinet: (id, params) => {
		console.log('/v1/cabinets/' + id, params);
		return instance.post('/v1/cabinets/' + id, params)
	},
	createCabinet: (params) => instance.post('/v1/cabinets', params),
	deleteCabinet: (id) => instance.delete('/v1/cabinets/' + id),
	getBoxesInCabinet: (id) => instance.get('/v1/cabinets/' + id + '/boxes'),
	getCabinetById: (id) => instance.get('/v1/cabinets/' + id),

	// API for Cainet Template
	createCabinetTemplate: (params) => instance.post('/v1/cabinet-templates', params),
	getCabitnetTemplate: () => instance.get('/v1/cabinet-templates'),
	getTemplateByCabinetId: (id) => instance.get('/v1/cabinets/' + id + '/template-info'),


	// API for Box 
	updateBoxStatus: (params) => instance.post('/v1/boxes/status/' + params.status + '?cabinetId=' + params.cabinetId + '&boxNum=' + params.boxNum),
	openBox: (params) => instance.post('/v1/boxes/' + params + '/open'),
	getBoxHistory: (params) => instance.get('/v1/box-sizes/box/' + params.boxId + '/from-to?from=' + params.from + "&to=" + params.to),
	getBoxHistoryCount: (params) => instance.get('/v1/box-histories/box/' + params.boxId + '?itemCnt=' + params.count),

	// API for Box Size Model
	getBoxSizes: () => instance.get('/v1/box-sizes'),
	createBoxSize: (params) => instance.post('/v1/box-sizes', params),
	deleteBoxSize: (id) => instance.delete('/v1/box-sizes/' + id),
	// API for User Model


	getUser: () => instance.get('/v1/users'),
	createUser: (params) => instance.post('/v1/users/admin/create-user', params),
	updateUser: (params) => instance.post('/v1/users', params),
	updateStatusUser: (params) => instance.post('/v1/users/admin/user-status', params),

	// API for Rental Transaction Model
	getTransaction: () => instance.get('/v1/rental-transactions'),
	//api/v1/rental-transactions/{id}/status/{statusCode}
	updateTransactionStatus: (id, status) => instance.post('/v1/rental-transactions/' + id + '/status/' + status),

	// API for Locations

	getLocation: () => instance.get('/v1/locations'),
	createLocation: (params) => instance.post('/v1/locations', params),

	// API for Rent Time Slot Model
	getTimeSlots: () => instance.get('/v1/rent-time-slots'),
	deleteTimeSlot: (id) => instance.delete('/v1/rent-time-slots/' + id),
	createTimeSlot: (params) => instance.post('/v1/rent-time-slots', params),



	// API for Checking Request

	getCheckingRequest: () => instance.get('/v1/checking-request'),
	createCheckingRequest: (params) => instance.post('/v1/checking-request', params),
	updateCheckingRequest: (id, params) => {
		return instance.post('/v1/checking-request/' + id + '/assignee?newAssignee=' + params)
	},

	detailRequest: (params) => instance.post('/request/post_fb_detail', params),
	getRequest: (requestId) => instance.get('/request/request_edit/' + requestId),
	editRequest: (params) => instance.post('/request/request_edit', params),
	getWallet: () => instance.get('/wallet/info'),
	getTrans: () => instance.get('/wallet/transactions'),
	request2FA: (params) => instance.post('/wallet/require-2fa', params),
	withdraw: (params) => instance.post('/wallet/withdraw', params),
}

export default adminApi;