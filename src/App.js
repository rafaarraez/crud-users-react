import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
	const [users, setUsers] = useState({});
	const [edit, setedit] = useState(false);
	const [fecha, setfecha] = useState(new Date());

	const [datos, setDatos] = useState({
		nombre: '',
		apellido: '',
		cedula: '',
		email: '',
		fecha_de_nacimiento: '',
		foto: ''
	})
	const [loading, setLoading] = useState(true);
	const form = useRef(null)

	const handleInputChange = (event) => {
		setDatos({
			...datos,
			[event.target.name]: event.target.value
		})
	}

	const onChangeDate = date => {
		setDatos({
			...datos,
			fecha_de_nacimiento: moment(date).format('YYYY-MM-DD')
		})
		setfecha(new Date(date))
	}


	useEffect(() => {
		axios.get(`http://127.0.0.1:4000/api/users`)
			.then(res => {
				setUsers(res.data);
				setLoading(false);
				console.log(res.data);
			});
	}, []);

	const submit = e => {
		e.preventDefault()
		setLoading(true);
		console.log(datos);
		axios.post('http://127.0.0.1:4000/api/add', datos)
			.then(res => {
				setUsers(res.data);
				setDatos({
					nombre: '',
					apellido: '',
					cedula: '',
					email: '',
					fecha_de_nacimiento: '',
					foto: ''
				});
				setfecha(new Date());
			});
		setLoading(false)

	}

	const deleteUser = (id) => {
		var message = window.confirm('¿Seguro que desea eliminar?');
		if (message === true) {
			setLoading(true);
			axios.get(`http://127.0.0.1:4000/api/delete/${id}`, datos)
				.then(res => {
					setUsers(res.data);
				});
			setLoading(false)
		}
	}

	const editUser = (id) => {

		axios.get(`http://127.0.0.1:4000/api/update/${id}`)
			.then(res => {
				setDatos({
					id: res.data.id,
					nombre: res.data.nombre,
					apellido: res.data.apellido,
					cedula: res.data.cedula,
					email: res.data.email,
					fecha_de_nacimiento: moment(res.data.fecha_de_nacimiento).format('YYYY-MM-DD')
				});
				setfecha(new Date(res.data.fecha_de_nacimiento));
				console.log(datos);
				setedit(true);
			});
	}

	const cancelar = () => {
		setDatos({
			nombre: '',
			apellido: '',
			cedula: '',
			email: '',
			fecha_de_nacimiento: '',
			foto: ''
		});
		setfecha(new Date());
		setedit(false);
	}

	const saveEdit = (e, id) => {
		e.preventDefault()
		setLoading(true);
		axios.post(`http://127.0.0.1:4000/api/update/${id}`, datos)
			.then(res => {
				setUsers(res.data);
				setDatos({
					nombre: '',
					apellido: '',
					cedula: '',
					email: '',
					fecha_de_nacimiento: '',
					foto: ''
				});
				setfecha(new Date());
				setedit(false);
			});
		setLoading(false)
	}

	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			console.log(file);
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}

	const fileSelectHandler = (e) => {
		const file = e.target.files[0];
		getBase64(file).then(
			data => setDatos({
				...datos,
				foto: data
			})
		);
	};


	return (
		<div className="App">
			<nav className="navbar navbar-dark bg-dark">
				<a className="navbar-brand" href="/">Proyecto V Algoritmos y Estructura</a>
			</nav>
			<div className="container mt-5">
				<div className="row">
					<div className="col-md-4">
						<div className="card">
							<div className="card-body">
								{
									edit ? (
										<form enctype="multipart/form-data" ref={form} onSubmit={(e) => saveEdit(e, datos.id)}>
											<div className="form-group">
												<label htmlFor="nombre">Nombre</label>
												<input type="text" name="nombre" className="form-control" id="nombre" value={datos.nombre} onChange={handleInputChange} required />
											</div>
											<div className="form-group">
												<label htmlFor="apellido">Apellido</label>
												<input type="text" name="apellido" className="form-control" id="apellido" value={datos.apellido} onChange={handleInputChange} required />
											</div>
											<div className="form-group">
												<label htmlFor="cedula">Cedula</label>
												<input type="text" name="cedula" className="form-control" id="cedula" value={datos.cedula} onChange={handleInputChange} required />
											</div>
											<div className="form-group">
												<label htmlFor="email">Email</label>
												<input type="email" name="email" className="form-control" id="email" value={datos.email} onChange={handleInputChange} required />
											</div>
											<div className="form-group">
												<label htmlFor="img">Foto</label>
												<input type="file" name="foto" className="form-control" id="img" accept="image/*" onChange={fileSelectHandler} required />
											</div>
											<div className="form-group">
												<label htmlFor="date">Fecha de Nacimiento</label>
												<DatePicker className="form-control" selected={fecha} onChange={onChangeDate} />
											</div>
											<div>
												<button type="submit" className="btn btn-primary">Guardar Cambios</button>
												{' '}
												<button onClick={() => cancelar(datos.id)} className="btn btn-danger">Cancelar</button>
											</div>


										</form>
									) : (
											<form enctype="multipart/form-data" ref={form} onSubmit={submit}>
												<div className="form-group">
													<label htmlFor="nombre">Nombre</label>
													<input type="text" name="nombre" className="form-control" id="nombre" value={datos.nombre} onChange={handleInputChange} required />
												</div>
												<div className="form-group">
													<label htmlFor="apellido">Apellido</label>
													<input type="text" name="apellido" className="form-control" id="apellido" value={datos.apellido} onChange={handleInputChange} required />
												</div>
												<div className="form-group">
													<label htmlFor="cedula">Cedula</label>
													<input type="text" name="cedula" className="form-control" id="cedula" value={datos.cedula} onChange={handleInputChange} required />
												</div>
												<div className="form-group">
													<label htmlFor="email">Email</label>
													<input type="email" name="email" className="form-control" id="email" value={datos.email} onChange={handleInputChange} required />
												</div>
												<div className="form-group">
													<label htmlFor="img">Foto</label>
													<input type="file" name="foto" id="img" accept="image/*" onChange={fileSelectHandler} required />
												</div>
												<div className="form-group">
													<label htmlFor="date">Fecha de Nacimiento</label>
													<DatePicker className="form-control" selected={fecha} onChange={onChangeDate} />
												</div>

												<button type="submit" className="btn btn-primary">Submit</button>

											</form>
										)
								}
							</div>
						</div>
					</div>
					{
						loading ? (
							<p>Cargando..</p>
						) : Object.keys(users).length === 0 ? (
							<p>No hay usuarios aun</p>
						) : (
									<div className="col-md-8 mt-4 mt-md-0">
										<div className="row justify-content-between">
											{
												users.map((user) => (
													<div key={user.id} className="col-md-6">
														<div className="card mb-2">
															<img className="card-img-top" src={user.foto} alt="Card cap" />
															<div className="card-body text-center">
																<h5 className="card-title">ID: {user.id}, {user.nombre} {user.apellido}</h5>
																<p className="card-text">C.I.: {user.cedula}</p>
																<button onClick={() => editUser(user.id)} className="btn btn-primary">Editar</button> {' '}
																<button onClick={() => deleteUser(user.id)} className="btn btn-danger">Eliminar</button>
															</div>
														</div>
													</div>
												))
											}

										</div>
									</div>
								)
					}

				</div>
			</div>
		</div>
	);
}

export default App;
