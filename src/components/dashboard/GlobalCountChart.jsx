import { Card, Flex, Title } from '@tremor/react';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

export default function GlobalCountChart(){
    const [ users, setUsers ] = useState()
    const [ orders, setOrders ] = useState()
    const [ categories, setCategories ] = useState()
    const [ products, setProducts ] = useState()
    useEffect(()=> {
        fetch(
            `${import.meta.env.VITE_API_URL}admin/all`,
            {
                method: 'GET',
                headers: {
                    'Authorization': "Bareer " + localStorage.getItem('jwt') 
                },
            }
        )
        .then(res => res.json())
        .then(res => {
          setUsers(res.users)
          setOrders(res.orders)
          setProducts(res.products)
          setCategories(res.categories)
        })
    }, [])
    return (
        <Card className='w-3/3 flex items-center gap-8 flex-col @container/count @[1130px]/dashboard:w-1/3'>
            <Title>
                Nous avons
            </Title>
            <Flex className='gap-8 flex-col @[340px]/count:flex-row'>
                <div className="bg-tremor-background rounded-md shadow-tremor-card px-5 py-3 w-full">
                    <div className='flex flex-col justify-center items-center  gap-3'>
                        {/* <h3 className='text-bold text-green-800'>Nous avons</h3> */}
                        <h1 className='text-bold text-3xl text-colors-light w-16 h-16 rounded-full bg-green-800 flex justify-center items-center'>
                            <CountUp 
                                end={orders}
                                duration={3} 
                                className='bg-r'
                            />
                        </h1>
                        <h3 className='text-green-800'>Commandes</h3>
                    </div>          
                </div>
                <div className="bg-tremor-background rounded-md shadow-tremor-card px-5 py-3 w-full">
                    <div className='flex flex-col justify-center items-center  gap-3'>
                        {/* <h3 className='text-bold text-yellow-800'>Nous avons</h3> */}
                        <h1 className='text-bold text-3xl text-colors-light w-16 h-16 rounded-full bg-yellow-800 flex justify-center items-center'>
                            <CountUp 
                                end={products}
                                duration={3} 
                            />
                        </h1>
                        <h3 className='text-yellow-800'>Produits</h3>
                    </div>          
                </div>
            </Flex>
            <Flex className='gap-8 flex-col @[340px]/count:flex-row'>
                <div className="bg-tremor-background rounded-md shadow-tremor-card px-5 py-3 w-full">
                    <div className='flex flex-col justify-center items-center  gap-3'>
                        {/* <h3 className='text-bold text-sky-500'>Nous avons</h3> */}
                        <h1 className='text-bold text-3xl text-colors-light w-16 h-16 rounded-full bg-sky-500 flex justify-center items-center'>
                            <CountUp 
                                end={users}
                                duration={3} 
                            />
                        </h1>
                        <h3 className='text-sky-500'>Utilisateurs</h3>
                    </div>          
                </div>
                <div className="bg-tremor-background rounded-md shadow-tremor-card px-5 py-3 w-full">
                    <div className='flex flex-col justify-center items-center  gap-3'>
                        {/* <h3 className='text-bold text-colors-blue'>Nous avons</h3> */}
                        <h1 className='text-bold text-3xl text-colors-light w-16 h-16 rounded-full bg-colors-blue flex justify-center items-center'>
                            <CountUp 
                                end={categories}
                                duration={3} 
                            />
                        </h1>
                        <h3 className='text-colors-blue'>Categories</h3>
                    </div>          
                </div>
            </Flex>
        </Card>
    )
}