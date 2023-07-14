import { useEffect, useState } from "react";
import { Card, Title, Select, SelectItem, DonutChart, Flex } from "@tremor/react";
import { set } from "mongoose";

const DonutCard = ()=>{
    const [ selectedMonth, setSelectedMonth ] = useState(new Date().getMonth() + 1);
    const [ selectedYear, setSelectedYear ] = useState(new Date().getFullYear());
    const [ total, setTotal ] = useState(0)
    const [ ordersList, setOrdersList ] = useState([])
    const monthArray = [  'janvier',  'février',  'mars',  'avril',  'mai',  'juin',  'juillet',  'août',  'septembre',  'octobre',  'novembre',  'décembre'];
    const yearsArray = Array.from({ length: 51 }, (_, index) => 2000 + index);

    const updateChart = (orders) => {
        let arr = [
            {
              name: "Not processed",
              sales: 0,
            },
            {
              name: "Shipped",
              sales: 0,
            },
            {
              name: "Delivered",
              sales: 0,
            },
            {
              name: "Cancelled",
              sales: 0,
            }
        ]
        setTotal(0)
        for(let i = 0; i < arr.length; i++){
            let count = 0;
            orders.map(item => {
                if(item.status == arr[i].name){
                    count = count+1;
                    setTotal(prv => prv + 1)
                }
            })
            arr[i].sales = count
        }
        setOrdersList(arr)
    }

    const valueFormatter = (number) => `$ ${Intl.NumberFormat("us").format(number).toString()}`;
    useEffect(() => {
      fetch(
          `${import.meta.env.VITE_API_URL}orders/month`,
          {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': "Bareer " + localStorage.getItem('jwt') 
              },
              body: JSON.stringify({year: selectedYear, month: selectedMonth})
          }
      )
      .then(res => res.json())
      .then(res => {
        updateChart(res)
      })
    }, [selectedMonth, selectedYear])
    return (
        <Card className="w-4/4 @container/main flex flex-col gap-4 @[1130px]/dashboard:w-1/4">
            <h1 className="text-colors-light">
                Les commandes:
            </h1>
            <Flex className="flex-col gap-2 @xs/main:flex-row">
                <div className="max-w-xs mx-auto space-y-6">
                    <Select
                        className="w-auto"
                        value={String(selectedMonth)}
                        onChange={(selected) =>{setSelectedMonth(selected);}}
                        placeholder="choisir le mois"
                        >
                        { monthArray
                            .map((month, index) => 
                                    (<SelectItem key={index} value={String(index+1)} >{month}</SelectItem>))}
                    </Select>
                </div>
                <div className="max-w-xs w-auto mx-auto space-y-6 bg ">
                    <Select
                        className="w-auto"
                        value={String(selectedYear)}
                        onChange={(selected) =>{setSelectedYear(selected);}}
                        placeholder="Choisir l'annees"
                        >
                        { yearsArray
                            .map((year, index) => 
                                    (<SelectItem key={index} value={String(year)} >{year}</SelectItem>))}
                    </Select>
                </div>
            </Flex>
            <DonutChart
                className="mt-6"
                data={ordersList}
                category="sales"
                index="name"
                label={`${total} ordres`}
                valueFormatter={valueFormatter}
                colors={["slate", "violet", "green", "rose",]}
            />
            <Flex className="flex-wrap gap-2 justify-center">
                <div className="flex gap-2 flex-wrap justify-center">
                    <div className="w-4 h-4 bg-slate-800"></div> <p className="text-colors-light">Not processed</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                    <div className="w-4 h-4 bg-violet-800"></div> <p className="text-colors-light">Shipped</p>
                </div>
            </Flex>
            <Flex className="flex-wrap gap-2 justify-center">
                <div className="flex gap-2 flex-wrap justify-center">
                    <div className="w-4 h-4 bg-green-800"></div> <p className="text-colors-light">Delivered</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                    <div className="w-4 h-4 bg-rose-800"></div> <p className="text-colors-light">Cancelled</p>
                </div>
            </Flex>
        </Card>
    )
}
export default DonutCard;