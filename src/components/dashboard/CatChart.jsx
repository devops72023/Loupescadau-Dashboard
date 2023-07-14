import { Title, BarChart, Subtitle } from "@tremor/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";


const dataFormatter = (number) => {
  return "" + Intl.NumberFormat("us").format(number).toString();
};

const CatChart = () => {
  const { settings } = useContext(AppContext)
  const [ data, setData ] = useState([])
  useEffect(()=>{
    fetch(
      `${import.meta.env.VITE_API_URL}admin/countProductsByCategory`,
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
          <div className="bg-white w-4/4 p-5 rounded-md shadow-md flex flex-col justify-between gap-4 @[1130px]/dashboard:w-3/4">
            <h1 className="text-colors-blue text-bold text-[25px]">Le Nombre des produits dans chaque categorie</h1>
            <BarChart
              className="mt-6 "
              data={data}
              index="name"
              categories={["Nombre des produit"]}
              colors={['blue']}
              valueFormatter={dataFormatter}
              yAxisWidth={48}
            />
          </div>
        )
};

export default CatChart