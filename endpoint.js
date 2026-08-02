http://localhost:3000/api/report?fromDate=2026-07-01&toDate=2026-07-28
<Grid size={{ xs: 12, md: 2 }}>
  <TextField
    fullWidth
    select
    size="small"
    label="User Name"
    value={username}
    onChange={(e) => setUserName(e.target.value)}
  >
    <MenuItem value="">
      Select UserName
    </MenuItem>

    {usernames.map((name: string) => (
      <MenuItem
        key={name}
        value={name}
      >
        {name}
      </MenuItem>
    ))}
  </TextField>
</Grid>
