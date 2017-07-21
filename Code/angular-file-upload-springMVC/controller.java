@RequestMapping(value = "/uploadFile", method = RequestMethod.POST)
@ResponseBody
public Object uploadFile(@RequestParam(value = "file", required = false) MultipartFile file, HttpServletRequest request) {
    String path = request.getSession().getServletContext().getRealPath("upload");
    long staffId = SessionInfo.getStaffId(request);
    return oprtService.uploadFile(path, file, staffId);
}
