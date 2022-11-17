import {useEffect, useState} from "react";

// MUI
import {Grid, Container, Typography, CircularProgress, Backdrop} from '@mui/material';

// Components
import SummaryCard from './SummaryCard';

// Graphs
import ReactECharts from 'echarts-for-react';

// Firebase
import {collection, getDocs, query} from "firebase/firestore";
import {db} from "../../../../firebase";

// Toast
import {toast} from 'react-toastify';

// Utils
import moment from "moment";

export default function DashboardAppPage() {

    const [totalUser, setTotalUser] = useState(0)
    const [todayUser, setTodayUser] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [option,setOption]=useState({
        xAxis: {
            type: 'category',
            data: ['date', 'date', 'date', 'date', 'date', 'date', 'date']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [0, 0, 0, 0, 0, 0, 0],
                type: 'line'
            }
        ]
    })

    let aoption = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
            }
        ]
    };


    // calculate the sum of new users in chosen time internal
    function findDateUser(userList){
        try{
            // store the result
            const grouper = new Map();
            // set the time interval
            for(let i=0;i<7;i++)
            {
                const goalDate=moment().subtract(i,"days").format('YYYY MM DD');
                grouper.set(goalDate,0);
            }

            // find new date
            userList.forEach((item,index)=>{
                const dt=item.dt;
                // if is new user in time interval
                // numbers of new user on that day add 1
                if(grouper.has(dt)){
                    let i=grouper.get(dt);
                    i=i+1;
                    grouper.set(dt, i);
                }else{

                }
            })

            return grouper;

        }catch (error){
            toast.error(error)
        }
    }

    async function getData() {
        try{
            // load start
            setIsLoading(true)
            const userData = [];

            // get all the users data
            const res = await getDocs(query(collection(db, "profile")));
            // format the value of date
            if (res) {
                for (const document of res.docs) {
                    userData.push({...document.data(), dt: moment(document.data().dt.toDate()).format('YYYY MM DD')});
                }

                // get total number of users
                setTotalUser(userData.length);
            }


            // get today time
            const today= moment().format('YYYY MM DD');

            // get the numbers of time internal(7 days incldes today)
            const DateUser= findDateUser(userData);

            // get the number of new users today
            setTodayUser(DateUser.get(today));

            // get data for Echarts
            const xAxisDate=[];
            const yAxisDate=[];
            DateUser.forEach(function (value,key,DateUser) {
                xAxisDate.push(key);
                yAxisDate.push(value);
            })
            aoption.xAxis.data=xAxisDate.reverse();
            aoption.series[0].data=yAxisDate.reverse();

            setOption(aoption);

            // loading finish
            setIsLoading(false)

        }catch (error){
            toast.error(error)
        }
    }
    //Loading User List data for Table
    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <title> Analystic </title>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    New Registrations
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={6} >
                        <SummaryCard title="Total Users" total={totalUser} icon={'ant-design:android-filled'} />
                    </Grid>

                    <Grid item xs={6}>
                        <SummaryCard title="Today New Users" total={todayUser} color="info" icon={'ant-design:apple-filled'} />
                    </Grid>

                    <Grid item xs={12} textAlign={"center"}>
                        <Typography variant="h6" >
                            New Users History
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <ReactECharts option={option}/>
                    </Grid>
               </Grid>

            </Container>
        </>
    );
}
