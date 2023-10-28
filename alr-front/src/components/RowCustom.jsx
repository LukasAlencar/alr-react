import { TableCell, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { LiaFileContractSolid } from 'react-icons/lia'
import TrashIcon from './TrashIcon'
import { BsPencil } from 'react-icons/bs'
import axios from 'axios'
import { AiOutlineCheck } from 'react-icons/ai'
import { HiXMark } from 'react-icons/hi2'
import { Co2Sharp } from '@mui/icons-material'

const RowCustom = ({ datas, handleRemoveLicense, setIsLoading }) => {

    const [isEdit, setIsEdit] = useState(false)
    const handleChange = (e) => {
        let { value, name } = e.target

        setListAdd((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setListAdd(prev => ({ ...prev, contract: file }))
    }

    const [listAdd, setListAdd] = useState(
        {
            product: datas.name,
            contract: datas.contract,
            status: 'True',
            activateDate: datas.start_date,
            expirationDate: datas.end_date,

        }
    )

    const handleSaveLicense = async () => {
        setIsLoading(true);

        const formData = new FormData()
        formData.append('name', listAdd.product)
        formData.append('file', listAdd.contract)
        formData.append('status', listAdd.status)
        formData.append('start_date', listAdd.activateDate)
        formData.append('end_date', listAdd.expirationDate)

        await axios.put(`https://api.alrtcc.com/contract/${datas.id}`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false);
            })
        getApi()
    }

    useEffect(()=>{
        console.log(datas)
    },[])

    function getApi() {
        setIsLoading(true)

        axios.get('https://api.alrtcc.com/contracts/')
            .then(res => {
                setLicensesList(res.data)
            })
            .catch(err => console.log(err))
            .finally(() => setIsLoading(false))
    }


    if (isEdit) {
        return (
            <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="center"><input onChange={handleFileChange} type="file" accept='application/pdf' className='form-control' /></TableCell>
                <TableCell><input value={listAdd.product} onChange={handleChange} name='product' className='form-control text-center' type="text" /></TableCell>
                <TableCell align="center"><input onChange={handleChange} value={listAdd.activateDate} name='activateDate' className='form-control text-center' type="date" /></TableCell>
                <TableCell align="center"><input onChange={handleChange} value={listAdd.expirationDate} name='expirationDate' className='form-control text-center' type="date" /></TableCell>
                <TableCell align="center">
                    <div className='d-flex flex-1 justify-content-between'>
                        <button onClick={handleSaveLicense} style={{ maxWidth: 100 }} className='btn btn-success'><AiOutlineCheck /></button>
                        <button onClick={() => setIsEdit(false)} style={{ maxWidth: 100 }} className='btn btn-danger'><HiXMark /></button>
                    </div>
                </TableCell>

            </TableRow>
        )
    } else {
        return (
            <TableRow
                key={datas.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align='center'>
                    <LiaFileContractSolid fontSize={30} title='Download Contract' className='link' onClick={() => downloadContract(datas.file)} />
                </TableCell>
                <TableCell align="center">
                    {datas.name}
                </TableCell>

                <TableCell align="center">{datas.start_date}</TableCell>
                <TableCell align="center">{datas.end_date}</TableCell>
                <TableCell align="center">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <BsPencil className='mt-1' onClick={() => setIsEdit(true)} />
                        <TrashIcon width={20} uuid={datas.id} handleClick={() => handleRemoveLicense(datas.id)} />
                    </div>
                </TableCell>
            </TableRow>
        )
    }

}

export default RowCustom