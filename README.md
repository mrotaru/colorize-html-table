# colorize-table

## Use

```
$('#myTable').colorize({
  columns: [1,2,3]
});
```

## Options

`relativeScale` (default: `true`) 
For each column, determine minimum and maximum, and colorize
and use in color scaling

`min`, `max`
Values to be considered minimum and maximum by the color
scaling function. Setting these values precludes the use of
`relativeScale`.

`invert` (default: `false`)
Lower values will be considered `bad` and have a red shade.
(Normally, high = good)

## Result

![screenshot](http://i59.tinypic.com/1z6bey1.png)
