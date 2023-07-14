import { LineChart } from "@tremor/react";
import { useEffect, useState } from "react";

const dataFormatter = (number) => `${Intl.NumberFormat("us").format(number).toString()}€`;
export default function RevenueChart(){
    const [ data, setData ] = useState([])
    useEffect(()=>{
        fetch(
        `${import.meta.env.VITE_API_URL}admin/countRevenueByMonth`,
        {
            method: 'GET',
            headers: {
                'Authorization': "Bareer " + localStorage.getItem('jwt') 
            },
        }
        )
        .then(res => res.json())
        .then(res => {
        setData(res)
        })
    }, [])
    return (
        <div className="w-3/3 bg-colors-light p-5 rounded-md shadow-md @[1130px]/dashboard:w-2/3">
            <h2 className="text-colors-blue">Notre revenu durant l'année 2023</h2>
            <LineChart
            className="mt-6"
            data={data}
            index="month"
            categories={["Nous avons gagné"]}
            colors={["blue"]}
            valueFormatter={dataFormatter}
            yAxisWidth={40}
            />
        </div>
    )
}