import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { FullAdvisor } from '@/models';
import Link from 'next/link';

interface AdvisorCardProps {
  advisor: FullAdvisor;
}

export function AdvisorCard({ advisor }: AdvisorCardProps) {
  const image_url = advisor.image_url
    ? advisor.image_url
    : 'https://via.placeholder.com/150';

  return (
    <Link href={'/advisors/' + advisor.id} style={{ textDecoration: 'none' }}>
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
          <AspectRatio
            flex
            ratio="1"
            maxHeight={182}
            sx={{
              minWidth: 182,
              width: { xs: '100%', sm: 182 },
              maxWidth: { xs: '50%', sm: 'none' },
            }}
          >
            <img
              src={image_url}
              loading="lazy"
              alt={'image of ' + advisor.first_name}
              style={{ width: '100%', height: 'auto' }}
            />
          </AspectRatio>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <Typography fontSize="xl" fontWeight="700">
                {advisor.first_name}
              </Typography>
              <Typography
                level="body-sm"
                fontWeight="lg"
                textColor="text.tertiary"
              >
                {advisor.hometown}, {advisor.home_state}
              </Typography>
            </Box>
            <Typography
              level="body-md"
              fontWeight="lg"
              textColor="text.secondary"
            >
              {advisor.bio}
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
                <Typography fontWeight="lg">Majors</Typography>
                <Typography level="body-xs" fontWeight="lg">
                  {advisor.majors?.map((major) => (
                    <div key={major.id}>{major.name}</div>
                  ))}
                </Typography>
              </div>
              <div>
                <Typography fontWeight="lg">Varisty Sports</Typography>
                <Typography level="body-xs" fontWeight="lg">
                  {advisor.varsity_sports?.map((sport) => (
                    <div key={sport.id}>{sport.name}</div>
                  ))}
                </Typography>
              </div>
              <div>
                <Typography level="body-xs" fontWeight="lg">
                  Rating
                </Typography>
                <Typography fontWeight="lg">8.9</Typography>
              </div>
            </Sheet>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              {' '}
              <Typography fontSize="md" fontWeight="700">
                {advisor.first_name}
              </Typography>
              <Typography
                level="body-sm"
                fontWeight="lg"
                textColor="text.tertiary"
              >
                {advisor.hometown}, {advisor.home_state}
              </Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
              <Button variant="outlined" color="neutral">
                Chat
              </Button>
              <Button variant="solid" color="primary">
                Follow
              </Button>
            </Box> */}
          </CardContent>
        </Card>
      </Box>
    </Link>
  );
}
