/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Formik, Form } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import DateInput from './DateInput';
import Input from './Input';
import Select from './Select';

interface City {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
  surname: string;
  specialityId: string;
  isPediatrician: boolean;
  cityId: string;
}

interface DoctorSpecialty {
  id: string;
  name: string;
  params?: {
    gender?: string;
    maxAge?: number;
    minAge?: number;
  }
}

interface State {
  city: City[];
  doctors: Doctor[];
  doctorSpecialty: DoctorSpecialty[];
}

interface FormValues {
  name: string;
  date: string;
  sexType: string;
  city: string;
  doctorSpecialty: string;
  doctor: string;
  email: string;
}

export interface OtherProps {
  label: string;
  isError?: boolean;
}

const initialValues: FormValues = {
  name: '',
  date: '',
  sexType: '',
  city: '',
  doctorSpecialty: '',
  doctor: '',
  email: '',
}

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-zA-Z_ ]+$/, 'Numeric is not required').trim()
    .required('Required'),
  date: Yup.string()
    .required('Required'),
  sexType: Yup.string()
    .required('Required'),
  city: Yup.string()
    .required('Required'),
  doctorSpecialty: Yup.string()
    .required('Required'),
  doctor: Yup.string()
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

const MyForm = () => {
  const [state, setState] = useState<State | null>(null);

  const [city, setCity] = useState<City[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorSpecialty, setDoctorSpecialty] = useState<DoctorSpecialty[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // City https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4
  // Doctor Specialty https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca
  // Doctor https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21
  useEffect(() => {
    Promise.all([
      fetch('https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4'),
      fetch('https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca'),
      fetch('https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21')])
      .then(res => Promise.all(res.map(r => r.json())))
      .then((res: Array<City[] | Doctor[] | DoctorSpecialty[]>) => {
        setState({
          city: res[0] as City[],
          doctorSpecialty: res[1] as DoctorSpecialty[],
          doctors: res[2] as Doctor[],
        })

        setCity(res[0] as City[])
        setDoctorSpecialty(res[1] as DoctorSpecialty[])
        setDoctors(res[2] as Doctor[])

        setIsLoading(false)
      })
      .catch(error => console.log(error));
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ errors, values, handleChange, setFieldValue }) => {
        const onChangeDoctorSpecialty = (e: ChangeEvent<HTMLSelectElement>) => {
          const doctorSpeciality = state?.doctorSpecialty.find(s => e.target.value === s.name)
          const allDoctors = state!.doctors.filter(d => d.specialityId === doctorSpeciality?.id)

          if (!values.city) {
            setDoctors(allDoctors);
          } else if (values.city) {
            const doctorsWithCity = allDoctors.filter((d) => state?.city.filter(s => s.id === d.cityId));

            setDoctors(doctorsWithCity);
          }

          setFieldValue('doctorSpecialty', e.target.value)
          setFieldValue('doctor', '')
        }

        const onChangeCity = (e: ChangeEvent<HTMLSelectElement>) => {
          const myCity = state?.city.find(c => e.target.value === c.name);

          const allDoctors = state!.doctors.filter(d => d.cityId === myCity?.id)

          if (!values.doctorSpecialty) {
            setDoctors(allDoctors);
          } else if (values.doctorSpecialty) {
            const doctorSpeciality = allDoctors.filter((d) => state?.doctorSpecialty.filter(s => s.id === d.specialityId));
            setDoctors(doctorSpeciality);
          }

          setFieldValue('city', e.target.value)
        }

        const onChangeDoctor = (e: ChangeEvent<HTMLSelectElement>) => {
          const doctor = state!.doctors.find(d => e.target.value === `${d.name} ${d.surname}`);

          if (!values.city || !values.doctorSpecialty) {
            const doctorCity = state?.city.find(c => c.id === doctor?.cityId)
            const doctorSpeciality = state?.doctorSpecialty.find(c => c.id === doctor?.specialityId)

            setFieldValue('city', doctorCity?.name)
            setFieldValue('doctorSpecialty', doctorSpeciality?.name)
          }

          setFieldValue('doctor', e.target.value)
        }

        const onChangeSex = (e: ChangeEvent<HTMLSelectElement>) => {
          setFieldValue('sexType', e.target.value)
        }

        return (
          <Form>

            <Input label="Name" type="text" name="name" placeholder="Jane" isError={Boolean(errors.name)} />

            <DateInput label="Date" type="text" name="date" onChange={handleChange} />

            <Select label="Sex Type" name="sexType" onChange={onChangeSex}>
              <option value="">Select sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>

            <Select label="City" name="city" onChange={onChangeCity}>
              <option value="">Select city</option>
              {city.map((v) => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </Select>

            <Select
              label="Doctor Specialty"
              name="doctorSpecialty"
              onChange={onChangeDoctorSpecialty}
            >
              <option value="">Select Doctor Specialty</option>
              {doctorSpecialty.map((v) => (
                <option key={v.id} value={v.name} >{v.name}</option>
              ))}
            </Select>

            <Select label="Doctor" name="doctor" onChange={onChangeDoctor}>
              <option value="">Select Doctor</option>
              {doctors.map((v) => (
                <option key={v.id} value={`${v.name} ${v.surname}`}>{`${v.name} ${v.surname}`}</option>
              ))}
            </Select>


            <Input label="Email" type="email" name="email" placeholder="placeholder@gmail.com" isError={Boolean(errors.name)} />

            <button type="submit">Submit</button>
          </Form>
        )
      }
      }
    </Formik >
  )
};

export default MyForm;
