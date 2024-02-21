import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import React, { useState } from 'react'

interface Props {
    compartment: string;
    totalSeat: number;
}


const SeatChart = ({compartment,totalSeat}:Props) => {
    const [count, setCount] = useState(0);
const [limit, setLimit] = useState(0);
  return (
    <Grid gap={5}>
        {[...Array(totalSeat).keys()].map((index) => (
                <GridItem
                    key={index}
                    width="100%"
                    height="10"
                >
                    <Flex>
                        {
                            // for (let i=0;i<5;i++){
                            //     <Box
                            //         w="20px"
                            //         h="20px"
                            //         bg="gray"
                            //         borderRadius="5px"
                            //         ml="5px"
                            //     ></Box>
                            // }
                        }
                    </Flex>
                </GridItem>
        ))}
    </Grid>
  )
}

export default SeatChart