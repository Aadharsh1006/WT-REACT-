import React, { useEffect, useState } from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { getAllUsers } from '../services/UserApi';

const UserList = () => {

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchData = () => getAllUsers()
            .then((res) => setUserList(res.data))
            .catch((error) => console.log(error));
        fetchData();
    }, [])

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: '#1d1d1d', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            {
                userList.map((item) => (
                    <ListItem key={item.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={item.name} src={item.name} />
                        </ListItemAvatar>
                        <ListItemText sx={{ display: 'flex', flexDirection: 'column' }}
                            primary={
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="#f1f1f1"
                                >
                                    {item.name}
                                </Typography>
                            }
                            secondary={
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="#f1f1f1"
                                >
                                    {item.email}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))
            }
        </List>
    )
}

export default UserList;
