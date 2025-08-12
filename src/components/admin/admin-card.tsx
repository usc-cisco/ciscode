import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button';

interface AdminCardProps {
    title: string;
    value: string | number;
    lastMonth: number;
    Icon: React.ElementType;
    handleView: () => void;
}

const AdminCard = ({ title, value, lastMonth, Icon, handleView }: AdminCardProps) => {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-between">
                <p>{lastMonth > 0 ? `+${lastMonth}` : `${lastMonth} `} from last month</p>
                <Button className='cursor-pointer' onClick={handleView}>
                    View All
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default AdminCard
