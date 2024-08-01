import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Advisor } from '@/models';
import Link from 'next/link';

interface AdvisorCardProps {
    advisor: Advisor;
}

export function AdvisorCard( { advisor }: AdvisorCardProps ) {

  const image_url = advisor.image_url ? advisor.image_url : "https://via.placeholder.com/150";

  return (
    <Link href={"/advisors/" + advisor.id}>
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          overflow: { xs: 'auto', sm: 'initial' },
        }}
      >
        <Card
          orientation="horizontal"
          sx={{
            width: '100%',
            flexWrap: 'wrap',
            [`& > *`]: {
              '--stack-point': '500px',
              minWidth:
                'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
            },
          }}
        >
          <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
            <img
              src={image_url}
              loading="lazy"
              alt={"image of " + advisor.first_name}
            />
          </AspectRatio>
          <CardContent>
            <Typography fontSize="xl" fontWeight="lg">
              {advisor.first_name}
            </Typography>
            <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
              {advisor.hometown}, {advisor.home_state}
            </Typography>
            <Sheet
              sx={{
                bgcolor: 'background.level1',
                borderRadius: 'sm',
                p: 1.5,
                my: 1.5,
                display: 'flex',
                gap: 2,
                '& > div': { flex: 1 },
              }}
            >
              <div>
                <Typography level="body-xs" fontWeight="lg">
                  Articles
                </Typography>
                <Typography fontWeight="lg">34</Typography>
              </div>
              <div>
                <Typography level="body-xs" fontWeight="lg">
                  Followers
                </Typography>
                <Typography fontWeight="lg">980</Typography>
              </div>
              <div>
                <Typography level="body-xs" fontWeight="lg">
                  Rating
                </Typography>
                <Typography fontWeight="lg">8.9</Typography>
              </div>
            </Sheet>
            <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
              <Button variant="outlined" color="neutral">
                Chat
              </Button>
              <Button variant="solid" color="primary">
                Follow
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Link>
  );
}
