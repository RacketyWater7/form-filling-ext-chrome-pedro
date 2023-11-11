import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { SheetPicker } from '../../components/common/SheetPicker';
import Browser from 'webextension-polyfill';

const Popup = () => {
  const [data, setData] = useState(null);
  const [warning, setWarning] = useState('');

  useEffect(() => {
    if (data) {
      // check if it has all the columns
      // all the columns used are listed:
      // First name
      // Last name

      const requiredColumns = ['First name', 'Last name'];
      const missingColumns = [];
      requiredColumns.forEach((column) => {
        if (!data[0].hasOwnProperty(column)) {
          missingColumns.push(column);
        }
      });
      if (missingColumns.length > 0) {
        setWarning(
          `The following columns are missing: ${missingColumns.join(', ')}`
        );
      } else {
        setWarning('');
      }

      console.log('got data:', data);
      // Send the data to the content script
      if (warning || missingColumns.length > 0) return;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(
          tabId,
          { type: 'submitData', data },
          (response) => {
            console.log('Submission response from content script:', response);
          }
        );
      });
    }
  }, [data]);

  const confirm = () => {
    if (!data) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(
        tabId,
        { type: 'submitData', data },
        (response) => {
          console.log('Submission response from content script:', response);
        }
      );
    });
  };

  return (
    <Box
      sx={{
        p: '1rem',
      }}
    >
      <SheetPicker setData={setData} />

      <Box
        sx={{
          mt: '1rem',
        }}
      >
        {
          <Typography variant="h6" color="red">
            {warning}
          </Typography>
        }
        {/* a button to open the new tab in same window with this url https://changeuser.coopculture.it/ */}
        <Typography variant="h6">
          Please click the button below to open the Case Entry Page before
          uploading the file.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '1rem',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              Browser.tabs.create({
                url: 'https://changeuser.coopculture.it/',
              });
            }}
          >
            Open Change User Page
          </Button>
          <>
            {warning && (
              <Button
                variant="contained"
                color="primary"
                sx={{
                  ml: '1rem',
                }}
                onClick={confirm}
              >
                Confirm and Upload
              </Button>
            )}
          </>
        </Box>
      </Box>
    </Box>
  );
};

export default Popup;

// "matches": ["https://changeuser.coopculture.it/*"],
